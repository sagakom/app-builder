import { initialize } from 'redux-form';
import { addToast, addErrors, TOAST_SUCCESS } from '@entando/messages';

import { setPage } from 'state/pagination/actions';
import {
  getPage, getPageChildren, setPagePosition, postPage, deletePage, getFreePages,
  getPageSettings, putPage, putPageStatus, getSearchPages,
  putPageSettings, patchPage,
} from 'api/pages';
import { getStatusMap, getPagesMap, getChildrenMap, getSelectedPage } from 'state/pages/selectors';
import { makeGetSelectedPageConfig } from 'state/page-config/selectors';
import { setPublishedPageConfig } from 'state/page-config/actions';
import {
  ADD_PAGES, SET_PAGE_LOADING, SET_PAGE_LOADED, TOGGLE_PAGE_EXPANDED, SET_PAGE_PARENT,
  MOVE_PAGE, SET_FREE_PAGES, SET_SELECTED_PAGE, REMOVE_PAGE, UPDATE_PAGE, SEARCH_PAGES,
  CLEAR_SEARCH, SET_REFERENCES_SELECTED_PAGE, CLEAR_TREE,
} from 'state/pages/types';
import { PAGE_STATUS_DRAFT, PAGE_STATUS_PUBLISHED, PAGE_STATUS_UNPUBLISHED } from 'state/pages/const';
import { history, ROUTE_PAGE_TREE, ROUTE_PAGE_CLONE, ROUTE_PAGE_ADD } from 'app-init/router';
import { TOAST_ERROR } from '@entando/messages/dist/state/messages/toasts/const';
import { generateJsonPatch } from 'helpers/jsonPatch';
import getSearchParam from 'helpers/getSearchParam';


const HOMEPAGE_CODE = 'homepage';
const RESET_FOR_CLONE = {
  code: '',
  titles: '',
  parentCode: '',
  fullTitles: '',
  fullPath: '',
  status: '',
  references: {},
};

const noopPromise = arg => new Promise(resolve => resolve(arg));

export const addPages = pages => ({
  type: ADD_PAGES,
  payload: {
    pages,
  },
});

export const setSearchPages = pages => ({
  type: SEARCH_PAGES,
  payload: {
    pages,
  },
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export const removePage = page => ({
  type: REMOVE_PAGE,
  payload: {
    page,
  },
});

export const setSelectedPage = page => ({
  type: SET_SELECTED_PAGE,
  payload: {
    page,
  },
});

export const setReferenceSelectedPage = references => ({
  type: SET_REFERENCES_SELECTED_PAGE,
  payload: {
    references,
  },
});

export const setPageLoading = pageCode => ({
  type: SET_PAGE_LOADING,
  payload: {
    pageCode,
  },
});

export const setPageLoaded = pageCode => ({
  type: SET_PAGE_LOADED,
  payload: {
    pageCode,
  },
});

export const togglePageExpanded = (pageCode, expanded) => ({
  type: TOGGLE_PAGE_EXPANDED,
  payload: {
    pageCode,
    expanded,
  },
});

export const movePageSync = (pageCode, oldParentCode, newParentCode, newPosition) => ({
  type: MOVE_PAGE,
  payload: {
    pageCode,
    oldParentCode,
    newParentCode,
    newPosition,
  },
});

export const setPageParentSync = (pageCode, oldParentCode, newParentCode) => ({
  type: SET_PAGE_PARENT,
  payload: {
    pageCode,
    oldParentCode,
    newParentCode,
  },
});

export const setFreePages = freePages => ({
  type: SET_FREE_PAGES,
  payload: {
    freePages,
  },
});

export const updatePage = page => ({
  type: UPDATE_PAGE,
  payload: {
    page,
  },
});

export const clearTree = () => ({
  type: CLEAR_TREE,
});

const wrapApiCall = apiFunc => (...args) => async (dispatch) => {
  const response = await apiFunc(...args);
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  dispatch(addErrors(json.errors.map(e => e.message)));
  if (json.errors && json.errors[0]) {
    dispatch(addToast(json.errors[0].message, TOAST_ERROR));
  }
  throw json;
};


export const fetchPage = wrapApiCall(getPage);
export const fetchPageChildren = wrapApiCall(getPageChildren);

export const sendDeletePage = page => async (dispatch) => {
  try {
    const response = await deletePage(page);
    const json = await response.json();
    if (response.ok) {
      dispatch(removePage(page));
      history.push(ROUTE_PAGE_TREE);
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const fetchPageTree = pageCode => async (dispatch) => {
  if (pageCode === HOMEPAGE_CODE) {
    const responses = await Promise.all([
      fetchPage(pageCode)(dispatch),
      fetchPageChildren(pageCode)(dispatch),
    ]);
    return [responses[0].payload].concat(responses[1].payload);
  }
  const response = await fetchPageChildren(pageCode)(dispatch);
  return response.payload;
};

/**
 * will call:
 * http://confluence.entando.org/display/E5/Page+Tree
 * /pages
 */
export const handleExpandPage = (pageCode = HOMEPAGE_CODE) => (dispatch, getState) => {
  const pageStatus = getStatusMap(getState())[pageCode];
  const toExpand = (!pageStatus || !pageStatus.expanded);
  const toLoad = (toExpand && (!pageStatus || !pageStatus.loaded));
  if (toLoad) {
    dispatch(setPageLoading(pageCode));
    return fetchPageTree(pageCode)(dispatch)
      .then((pages) => {
        dispatch(addPages(pages));
        dispatch(togglePageExpanded(pageCode, true));
        dispatch(setPageLoaded(pageCode));
      }).catch(() => {});
  }
  dispatch(togglePageExpanded(pageCode, toExpand));
  return noopPromise();
};

export const setPageParent = (pageCode, newParentCode) => (dispatch, getState) => {
  const state = getState();
  const page = getPagesMap(state)[pageCode];
  const oldParentCode = page.parentCode;
  if (newParentCode === oldParentCode) {
    return noopPromise();
  }
  const newChildren = getChildrenMap(state)[newParentCode];
  return setPagePosition(pageCode, newChildren.length + 1, newParentCode)
    .then((response) => {
      if (response.ok) {
        dispatch(setPageParentSync(pageCode, oldParentCode, newParentCode));
      } else {
        response.json().then((json) => {
          json.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        });
      }
    }).catch(() => {});
};


const movePage = (pageCode, siblingCode, moveAbove) => (dispatch, getState) => {
  if (pageCode === siblingCode) {
    return noopPromise();
  }
  const state = getState();
  const siblingPage = getPagesMap(state)[siblingCode];
  const page = getPagesMap(state)[pageCode];
  const oldParentCode = page.parentCode;
  const newParentCode = siblingPage.parentCode || HOMEPAGE_CODE;
  const newSiblingChildren = getChildrenMap(state)[newParentCode]
    .filter(code => code !== pageCode);
  const newSiblingIndex = newSiblingChildren.indexOf(siblingCode);
  const newPosition = (moveAbove ? newSiblingIndex : newSiblingIndex + 1) + 1;
  return setPagePosition(pageCode, newPosition, newParentCode)
    .then(() => {
      dispatch(movePageSync(pageCode, oldParentCode, newParentCode, newPosition));
    }).catch(() => {});
};

export const movePageAbove = (pageCode, siblingCode) => movePage(pageCode, siblingCode, true);
export const movePageBelow = (pageCode, siblingCode) => movePage(pageCode, siblingCode, false);


export const createPage = wrapApiCall(postPage);

export const sendPostPage = pageData => dispatch => createPage(pageData)(dispatch)
  .then((json) => {
    dispatch(addPages([json.payload]));
    return json;
  })
  .catch(() => { });

export const fetchFreePages = () => async (dispatch) => {
  try {
    const response = await getFreePages();
    const json = await response.json();
    if (response.ok) {
      dispatch(setFreePages(json.payload));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const clonePage = page => async (dispatch) => {
  try {
    const json = await fetchPage(page.code)(dispatch);
    dispatch(initialize('page', {
      ...json.payload,
      ...RESET_FOR_CLONE,
    }));
    history.push(ROUTE_PAGE_CLONE);
  } catch (e) {
    // do nothing
  }
};

export const fetchPageSettings = () => async (dispatch) => {
  try {
    const response = await getPageSettings();
    const json = await response.json();
    if (response.ok) {
      dispatch(initialize('settings', json.payload));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const sendPutPageSettings = pageSettings => async (dispatch) => {
  try {
    const response = await putPageSettings(pageSettings);
    const json = await response.json();
    if (response.ok) {
      dispatch(addToast(
        { id: 'pageSettings.success' },
        TOAST_SUCCESS,
      ));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const sendPutPage = pageData => async (dispatch) => {
  try {
    const response = await putPage(pageData);
    const json = await response.json();
    if (response.ok) {
      dispatch(updatePage(json.payload));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const sendPatchPage = pageData => async (dispatch, getState) => {
  try {
    const initialPageData = getSelectedPage(getState());
    const patch = generateJsonPatch(initialPageData, pageData);
    if (!patch.length) {
      return;
    }
    const response = await patchPage(patch, pageData.code);
    const json = await response.json();
    if (response.ok) {
      const page = json.payload;
      dispatch(setSelectedPage(page));
      dispatch(updatePage(page));
      dispatch(addToast(
        { id: 'singlePageSettings.updateSuccess' },
        TOAST_SUCCESS,
      ));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const fetchPageForm = pageCode => dispatch => fetchPage(pageCode)(dispatch)
  .then((response) => {
    dispatch(initialize('page', response.payload));
  })
  .catch(() => {});

export const loadSelectedPage = pageCode => dispatch =>
  fetchPage(pageCode || getSearchParam('parentCode') || HOMEPAGE_CODE)(dispatch)
    .then((response) => {
      dispatch(setSelectedPage(response.payload));
      return response.payload;
    })
    .catch(() => {});

const putSelectedPageStatus = status => (dispatch, getState) =>
  new Promise((resolve) => {
    const page = getSelectedPage(getState());
    if (!page) {
      resolve();
    }
    const newPage = {
      ...page,
      status: status === PAGE_STATUS_DRAFT ? PAGE_STATUS_UNPUBLISHED : status,
    };
    putPageStatus(page.code, status).then((response) => {
      if (response.ok) {
        dispatch(setSelectedPage(newPage));
        dispatch(updatePage(newPage));
        if (status === PAGE_STATUS_PUBLISHED) {
          const draftConfig = makeGetSelectedPageConfig(page.code)(getState());
          dispatch(setPublishedPageConfig(newPage.code, draftConfig));
        } else {
          dispatch(setPublishedPageConfig(newPage.code, null));
        }
      } else {
        response.json().then((json) => {
          json.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        });
      }
      resolve();
    }).catch(() => {});
  });

export const publishSelectedPage = () => (dispatch, getState) =>
  putSelectedPageStatus(PAGE_STATUS_PUBLISHED)(dispatch, getState);

export const unpublishSelectedPage = () => (dispatch, getState) =>
  putSelectedPageStatus(PAGE_STATUS_DRAFT)(dispatch, getState);

export const fetchSearchPages = (page = { page: 1, pageSize: 10 }, params = '') => async (dispatch) => {
  try {
    const response = await getSearchPages(page, params);
    const json = await response.json();
    if (response.ok) {
      dispatch(setSearchPages(json.payload));
      dispatch(setPage(json.metaData));
    } else {
      dispatch(addErrors(json.errors.map(e => e.message)));
    }
  } catch (e) {
    // do nothing
  }
};

export const clearSearchPage = () => (dispatch) => {
  dispatch(clearSearch());
  dispatch(initialize('pageSearch', {}));
};

export const initPageForm = pageData => (dispatch) => {
  dispatch(initialize('page', pageData));
  history.push(`${ROUTE_PAGE_ADD}?parentCode=${pageData.parentCode}`);
};

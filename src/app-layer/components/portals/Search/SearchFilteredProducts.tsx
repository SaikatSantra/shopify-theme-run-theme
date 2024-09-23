import React, {Children, useEffect, useState } from 'react'
import getCurrentActiveFilters from '../../../context/search/helpers/getCurrentActiveFilters'
import useSearch from '../../../context/search/useSearch'
import SearchProductCard from './Components/SearchProductCard'

import { InView } from 'react-intersection-observer';
import { ISearchAndFilterProduct } from '../../../context/search/types';
import SearchDummyProductCardGrid from './Components/SearchDummyProductCardGrid';
import LoadingIcon from '../MiniCart/Loading';
import { Interweave } from 'interweave';

interface PaginationLinkProps {
  index: number
  active: boolean,
}

const PaginationNavLink : React.FC<PaginationLinkProps> = ({ active, index, children }): JSX.Element => {
  const {inputEventHandlers } = useSearch()
  const child: any = Children.only(children)
  const childProps = {
    onClick: () => active ? null : inputEventHandlers.handleUpdatePageIndex(index, true, false)
  }
  return React.cloneElement(child, childProps, child.props.children)
}

interface PaginationProps {
  pageCount: number
  pageIndex: number,
}

// If changing here - please also change in pagination.liquid

const ArrowPrev: React.FunctionComponent = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 12"><path fill="#777" d="M0 6.004a.773.773 0 0 1 .167-.458L4.924.206A.6.6 0 0 1 5.354 0a.575.575 0 0 1 .438.186.66.66 0 0 1 .021.915L1.47 6.004l4.363 4.903a.672.672 0 0 1 .168.462.67.67 0 0 1-.189.454.608.608 0 0 1-.438.177.59.59 0 0 1-.43-.2L.188 6.464A.684.684 0 0 1 0 6.005L0 6.004Z"/></svg>
)

const ArrowNext: React.FunctionComponent = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 12"><path fill="#777" d="M6.001 6.004a.773.773 0 0 0-.166-.458L1.078.206A.6.6 0 0 0 .648 0a.575.575 0 0 0-.439.186.66.66 0 0 0-.021.915l4.343 4.904-4.363 4.903A.672.672 0 0 0 0 11.37a.67.67 0 0 0 .19.454.608.608 0 0 0 .437.177.59.59 0 0 0 .43-.2l4.757-5.338A.684.684 0 0 0 6 6.005l.001-.001Z"/></svg>
)

const Pagination: React.FC<PaginationProps> = ({ pageCount, pageIndex }): JSX.Element => {
  return (
    <div className={'pagination'}>
      {pageCount > 1 ? (
        <div className="container">
          <ol className='pagination__list'>
            <PaginationNavLink active={pageIndex === 1} index={(pageIndex - 1)}>
              <li className={`pagination__item pagination__item--prev ${pageIndex === 1 ? 'pagination__item pagination__item--prev--disabled' : ''}`}>
                <ArrowPrev />
                <span className="visually-hidden">Previous page</span>
              </li>
            </PaginationNavLink>
            {[...Array(pageCount).keys()].map((i) => {
              const active = (pageIndex === i + 1)
              const pageNumber = (i + 1).toString()
              return (
                <PaginationNavLink active={active} index={(i + 1)} key={i}>
                  <li className={active ? 'pagination__item pagination__item--active' : 'pagination__item'}>
                    { pageNumber }
                  </li>
                </PaginationNavLink>
              )
            })}
            <PaginationNavLink active={pageIndex === pageCount} index={(pageIndex + 1)}>
              <li className={`pagination__item pagination__item--next ${pageIndex === pageCount ? 'pagination__item--disabled' : ''}`}>
                <span className="visually-hidden">Next page</span>
                <ArrowNext />
              </li>
            </PaginationNavLink>
          </ol>
        </div>
      ) : ''}
    </div>)
}

interface Props {
  dataSet: DOMStringMap
}

const SearchFilteredProducts: React.FC<Props> = ({ dataSet }) => {

  const {
    productSearchResult,
    productSearchResultsState,
    searchFilters,
    config,
    pageIndex,
    filtersLoading,
    newPageLoading,
    inputEventHandlers,
  } = useSearch()
  const { noResultsSearchPage } = dataSet

  const pageCount = productSearchResult ? Math.ceil(productSearchResult.total / config.rProductsPerPage) : 0;

  const pageToRender = parseInt(dataSet.pageToRender) // the page to render, from the portal, eg for previous pages this is pages up to the requested page
  const requestedPage = parseInt(dataSet.requestedPage) // the page requested by the browser,  in the query string

  if (isNaN(pageToRender) || isNaN(requestedPage)) {
    console.error('Make sure request-page and page-to-render data attrs are on portal')
  }

  const [loadMoreClicked, setLoadMoreClicked] = useState(false)

  useEffect(() => {
    if (!newPageLoading) {
      setLoadMoreClicked(false)
    }
  }, [newPageLoading])

  if (!searchFilters) {
    return null
  }

  const selectedFilters = getCurrentActiveFilters(searchFilters)

  if ((!selectedFilters || selectedFilters.length < 1) && !productSearchResult) {
    return null
  }

  let productsToRender = [] as ISearchAndFilterProduct[][]

  if (config.rLoadMoreMode === 'loadMore' || config.rLoadMoreMode === 'infinite') {
    if (pageToRender === requestedPage) {
      //everything after requested page
      productsToRender = productSearchResultsState.slice(requestedPage).map(results => results.products)
    } else if (pageToRender < requestedPage) {
      productsToRender = productSearchResultsState[pageToRender]?.products ? [productSearchResultsState[pageToRender].products]  : []
    }
  } else {
    // needs to be an empty array if not found (undefined within an array makes the length 1 :facepalm: )
    productsToRender = productSearchResult?.products ? [productSearchResult.products] : []
  }

  if (productsToRender.length < 1 && pageToRender < requestedPage) {

    const liquidDummies = document.querySelector(`[data-page-to-render="${pageToRender}"] [data-liquid-dummies]`)
    if (liquidDummies) {
      liquidDummies.parentElement.innerHTML = '' // clear liquid dummies
    }
    return (
      //render dummy products in react land
      <div className={`filter__products ${filtersLoading ? 'is-loading' : ''}`}>
        <InView as="div" onChange={(inView) => {
          if (newPageLoading) return
          const newPageIndex = inView  ?  pageToRender : null;
          if (newPageIndex && newPageIndex !== pageIndex) {
            inputEventHandlers.handleUpdatePageIndex(newPageIndex, true, false)
          }
        }} className='product-card-container grid-list'>
          <SearchDummyProductCardGrid count={config.rProductsPerPage}/>
        </InView>
      </div>
    )
  }

  return (
    <>
      {productsToRender.length > 0 ? productsToRender[0].length === 0 ?  <p className="search__no-results"><Interweave content={noResultsSearchPage} noWrap={true} /></p>:
        (<div className={`filter__products ${filtersLoading ? 'is-loading' : ''}`}>
          {productsToRender.length > 0 &&
          <>
            {productsToRender.map((page, index) => (
              <InView key={index} as="div" onChange={(inView) => {
                if (config.rLoadMoreMode === 'paginate' || newPageLoading) return

                const newPageIndex = inView ? index + pageToRender : null;
                if (newPageIndex && newPageIndex !== pageIndex) {
                  inputEventHandlers.handleUpdatePageIndex(newPageIndex, false, false)
                }

              }} className="product-card-container grid-list">
                {page.map((product, index) => {

                  return <SearchProductCard key={index} product={product} dataSet={dataSet} />
                })}
              </InView>
            ))}

            {config.rLoadMoreMode === 'paginate' && <Pagination pageCount={pageCount} pageIndex={pageIndex} />}

            {config.rLoadMoreMode === 'loadMore' && pageToRender === requestedPage && pageIndex < pageCount && (
              <div className="grid-item grid-item--full-width">
                {
                  loadMoreClicked ?
                    <div className="loader">
                      <span className="loader__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20.201 5.169c-8.254 0-14.946 6.692-14.946 14.946 0 8.255 6.692 14.946 14.946 14.946s14.946-6.691 14.946-14.946c-.001-8.254-6.692-14.946-14.946-14.946zm0 26.58c-6.425 0-11.634-5.208-11.634-11.634 0-6.425 5.209-11.634 11.634-11.634 6.425 0 11.633 5.209 11.633 11.634 0 6.426-5.208 11.634-11.633 11.634z" opacity=".2"/><path d="M26.013 10.047l1.654-2.866a14.855 14.855 0 00-7.466-2.012v3.312c2.119 0 4.1.576 5.812 1.566z"><animateTransform attributeName="transform" attributeType="xml" dur="0.5s" from="0 20 20" repeatCount="indefinite" to="360 20 20" type="rotate"/></path></svg>
                      </span>
                    </div>: <button className='btn btn--primary btn--center btn--test' type='button' onClick={
                      () => {
                        // Classes on the button need to match in loadMore.js line 103(ish)
                        if(newPageLoading) return
                        setLoadMoreClicked(true)
                        const newPageIndex = Math.min(pageIndex + 1, pageCount);
                        inputEventHandlers.handleUpdatePageIndex(newPageIndex, true, false);

                      }}>Load More</button>}
              </div>)
            }

            {config.rLoadMoreMode === 'infinite' && pageToRender === requestedPage && pageIndex < pageCount && <InView as="div" onChange={(inView) => {
              if (inView) {
                const newPageIndex = Math.min(pageIndex + 1, pageCount);
                inputEventHandlers.handleUpdatePageIndex(newPageIndex, true, false);
              }
            }}>
              <>
                <div className='product-list-preloader' style={{ position: 'relative', top: '-100px' }}></div>
                <div className="loader">
                  <span className="loader__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20.201 5.169c-8.254 0-14.946 6.692-14.946 14.946 0 8.255 6.692 14.946 14.946 14.946s14.946-6.691 14.946-14.946c-.001-8.254-6.692-14.946-14.946-14.946zm0 26.58c-6.425 0-11.634-5.208-11.634-11.634 0-6.425 5.209-11.634 11.634-11.634 6.425 0 11.633 5.209 11.633 11.634 0 6.426-5.208 11.634-11.633 11.634z" opacity=".2"/><path d="M26.013 10.047l1.654-2.866a14.855 14.855 0 00-7.466-2.012v3.312c2.119 0 4.1.576 5.812 1.566z"><animateTransform attributeName="transform" attributeType="xml" dur="0.5s" from="0 20 20" repeatCount="indefinite" to="360 20 20" type="rotate"/></path></svg>
                  </span>
                </div>
              </>
            </InView>
            }
          </>}
        </div>) :
        <div className='filter__loading'>
          <LoadingIcon/>
        </div>}
    </>
  )
}

export default SearchFilteredProducts
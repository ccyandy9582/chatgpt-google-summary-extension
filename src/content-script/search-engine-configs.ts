import { getSearchParam, waitForElm } from './utils'
export interface SearchEngine {
  inputQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  extabarContainerQuery?: string[]
  contentContainerQuery?: string[]
  watchRouteChange?: (callback: () => void) => void
  name?: string
  siteName: string
  siteValue: string
  regex: string
}

export const config: Record<string, SearchEngine> = {
  google: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    name: 'gogole',
    siteName: 'Google',
    siteValue: 'google',
    regex: '(^(www.)?google.)',
  },
  bing: {
    inputQuery: ["[name='q']"],
    sidebarContainerQuery: ['#b_context'],
    appendContainerQuery: [],
    siteName: 'Bing',
    siteValue: 'bing',
    regex: '(^(www|cn).?bing.com)',
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
    appendContainerQuery: ['#cols', '#contents__wrap'],
    siteName: 'Yahoo!',
    siteValue: 'yahoo',
    regex: '(^(search.)?yahoo.)',
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.results--sidebar.js-results-sidebar'],
    appendContainerQuery: ['#links_wrapper'],
    siteName: 'DuckDuckGo',
    siteValue: 'duckduckgo',
    regex: '(^(www.)?duckduckgo.com)',
  },
  baidu: {
    inputQuery: ["input[name='wd']"],
    sidebarContainerQuery: ['#content_right'],
    appendContainerQuery: ['#container'],
    watchRouteChange(callback) {
      const targetNode = document.getElementById('wrapper_wrapper')!
      const observer = new MutationObserver(function (records) {
        for (const record of records) {
          if (record.type === 'childList') {
            for (const node of record.addedNodes) {
              if ('id' in node && node.id === 'container') {
                callback()
                return
              }
            }
          }
        }
      })
      observer.observe(targetNode, { childList: true })
    },
    siteName: 'Baidu',
    siteValue: 'baidu',
    regex: '(^(www.)?baidu.com)',
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
    appendContainerQuery: ['#_0_app_content'],
    siteName: 'kagi',
    siteValue: 'kagi',
    regex: '(^(www.)?kagi.com)',
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ['#search-result-aside'],
    appendContainerQuery: [],
    siteName: 'Yandex',
    siteValue: 'yandex',
    regex: '(^(w+.)?yandex.)',
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['#sub_pack'],
    appendContainerQuery: ['#content'],
    siteName: 'NAVER',
    siteValue: 'naver',
    regex: '(^(search.)?naver.com)',
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#side-right'],
    appendContainerQuery: [],
    siteName: 'Brave',
    siteValue: 'brave',
    regex: `(^(search.)?brave.com)`,
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#sidebar_results'],
    appendContainerQuery: [],
    siteName: 'searX',
    siteValue: 'searx',
    regex: '(^(www.)?searx.be)',
  },
  youtube: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    name: 'youtube',
    watchRouteChange(callback) {
      let currentUrl = window.location.href

      setInterval(() => {
        const videoId = getSearchParam(window.location.href)?.v
        if (window.location.href !== currentUrl && videoId) {
          waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
            if (document.querySelector('div.glarity--container')) {
              document.querySelector('div.glarity--container')?.remove()
            }
          })

          callback()
          currentUrl = window.location.href
        }
      }, 1000)
    },
    siteName: 'YouTube',
    siteValue: 'youtube',
    regex: '(^(www.)?youtube.com)',
  },
  yahooJpNews: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#yjnFixableArea.sc-feJyhm'],
    contentContainerQuery: ['div.article_body'],
    name: 'yahooJpNews',
    siteName: 'Yahoo! JAPAN ニュース',
    siteValue: 'yahooJpNews',
    regex: '(^news.yahoo.co.jp)',
  },
  pubmed: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    // extabarContainerQuery: ['aside.page-sidebar > div.inner-wrap'],
    extabarContainerQuery: ['aside.page-sidebar', 'aside.pmc-sidebar'],
    contentContainerQuery: ['div#abstract'],
    name: 'pubmed',
    siteName: 'PubMed',
    siteValue: 'pubmed',
    regex: '(^(w+.)?ncbi.nlm.nih.gov)',
  },
  newspicks: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['div.right-container'],
    contentContainerQuery: ['div#body div.article-body'],
    name: 'newspicks',
    siteName: 'NewsPicks',
    siteValue: 'newspicks',
    regex: '(^(www.)?newspicks.com)',
  },
  nikkei: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['aside.aside_au9xyxw'],
    contentContainerQuery: ['section.container_c1suc6un'],
    name: 'nikkei',
    siteName: 'Nikkei',
    siteValue: 'nikkei',
    regex: '(^(www.)?nikkei.com)',
  },
  github: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['div.Layout-sidebar'],
    contentContainerQuery: ['div.Box-body'],
    name: 'github',
    siteName: 'GitHub',
    siteValue: 'github',
    regex: '(^(www.)?github.com)',
  },
  githubIssues: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.Layout-sidebar'],
    appendContainerQuery: ['#repository-container-header'],
    extabarContainerQuery: ['div.Layout-main'],
    contentContainerQuery: ['div.Layout-main'],
    name: 'githubIssues',
    siteName: 'GitHub Issues',
    siteValue: 'githubIssues',
    regex: '(github\.com\/.*?\/.*?issues\/\d+)',
  },
  wsj: {
    inputQuery: ["input[type='search']"],             
    sidebarContainerQuery: ['.e1of74uw7'],
    appendContainerQuery: ['.e1d75se20'],
    extabarContainerQuery: ['.e1of74uw15'],           //where you want to show the ui
    contentContainerQuery: ['div.article-container'], //what you want to summarize
    name: 'wsj',
    siteName: 'Wall Street Journal',
    siteValue: 'wsj',
    regex: '(^(www.)?wsj.com)',
  },
  yf: {
    inputQuery: ["input#yfin-usr-qry"],
    sidebarContainerQuery: ['#module-dynamicRR'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['.caas-content-byline-wrapper'],
    contentContainerQuery: ['div.caas-body'],
    name: 'yf',
    siteName: 'Yahoo Finance',
    siteValue: 'yf',
    regex: '(finance.yahoo.com/news)',
  },
  reuters: {
    inputQuery: ["input[type='search']"],             
    sidebarContainerQuery: ['.regular-article-layout__right-rail__3o6zT'],
    appendContainerQuery: ['.article-header__heading__15OpQ'],
    extabarContainerQuery: ['.regular-article-layout__main__1tzD8'],           //where you want to show the ui
    contentContainerQuery: ['.article__content__6hMn9'], //what you want to summarize
    name: 'reuters',
    siteName: 'Reuters',
    siteValue: 'reuters',
    regex: '(^(www.)?reuters.com)',
  },
  wiki: {
    inputQuery: ["input[type='search']"],
    sidebarContainerQuery: ['#mw-panel-toc'],
    appendContainerQuery: ['.vector-sitenotice-container'],
    extabarContainerQuery: ['.mw-content-container'],
    contentContainerQuery: ['#content'],
    name: 'wiki',
    siteName: 'Wikipedia',
    siteValue: 'wiki',
    regex: '(^(www|en).?wikipedia.org)',
  },
  verge: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['.duet--layout--rail'],
    appendContainerQuery: ['.article-groups'],
    extabarContainerQuery: ['.duet--layout--rail'],
    contentContainerQuery: ['#content'],
    name: 'verge',
    siteName: 'The Verge',
    siteValue: 'verge',
    regex: '(^(www.)?theverge.com)',
  }
}

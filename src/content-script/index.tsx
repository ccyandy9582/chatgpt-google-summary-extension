import { render } from 'preact'
import '../base.css'
import { getProviderConfigs, getUserConfig, Language, Theme } from '../config'
import { defaultPrompt, detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import { getSummaryPrompt } from './prompt'
import { config, SearchEngine } from './search-engine-configs'
import {
  getConverTranscript,
  getLangOptionsWithLink,
  getPossibleElementByQuerySelector,
  getSearchParam,
  waitForElm,
} from './utils'

import './styles.scss'

interface MountProps {
  question: string
  siteConfig: SearchEngine
  transcript?: any
  langOptionsWithLink?: any
}

const hostname = location.hostname
const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName =
  hostname === 'news.yahoo.co.jp'
    ? 'yahooJpNews'
    : hostname === 'finance.yahoo.com'
    ? 'yf'
    : hostname.includes('wikipedia.org')
    ? 'wiki'
    : hostname.includes('www.reuters.com')
    ? 'reuters'
    : hostname.includes('www.theverge.com')
    ? 'verge'
    : hostname.includes('wsj.com')
    ? 'wsj'
    : hostname.includes('ncbi.nlm.nih.gov')
    ? 'pubmed'
    : hostname === 'newspicks.com'
    ? 'newspicks'
    : hostname.includes('nikkei.com')
    ? 'nikkei'
    : hostname.includes('github.com') && location.href.includes('issues')
    ? 'githubIssues'
    : hostname.includes('github.com')
    ? 'github'
    : hostname.match(siteRegex)![0]
console.log('debug', 'siteName', siteName)
const siteConfig = config[siteName]

async function mount(props: MountProps) {
  const { question, siteConfig, transcript, langOptionsWithLink } = props
  const userConfig = await getUserConfig()

  const sites = Object.values(config).map((site) => {
    return site.siteValue
  })

  const enableSites = userConfig.enableSites ? userConfig.enableSites : sites

  const regexList = []
  Object.values(enableSites).map((v) => {
    const item = config[v]

    console.log('item', item, item.regex)
    if (item.regex) {
      regexList.push(item.regex)
    }
  })

  if (regexList.length <= 0) {
    return
  }
  const sitesRegex = new RegExp(regexList.join('|'))
  console.log('sitesRegex', sitesRegex)

  if (!sitesRegex.test(hostname)) {
    return
  }

  if (document.querySelector('div.glarity--container')) {
    document.querySelector('div.glarity--container')?.remove()
  }

  const container = document.createElement('div')
  container.className = 'glarity--container'

  let theme: Theme
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme()
  } else {
    theme = userConfig.theme
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt--dark')
  } else {
    container.classList.add('gpt--light')
  }

  if (siteName === 'pubmed') {
    container.classList.add('glarity--chatgpt--pubmed')

    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )

    console.log('appendContainer', appendContainer)

    appendContainer?.prepend(container)
  } else if (siteName === 'yahooJpNews') {
    container.classList.add('glarity--chatgpt--yahoonews')

    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'yf') {
    console.log('debug', 'yf appendContainer', '1')
    container.classList.add('glarity--chatgpt--yahoonews')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'wiki'){
    console.log('debug', 'appendContainer')
    container.classList.add('glarity--chatgpt--wiki')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'reuters') {
    container.classList.add('glarity--chatgpt--reuters')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'verge') {
    container.classList.add('glarity--chatgpt--verge')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'newspicks') {
    container.classList.add('glarity--chatgpt--newspicks')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'nikkei') {
    container.classList.add('glarity--chatgpt--nikkei')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'githubIssues') {
    container.classList.add('glarity--chatgpt--github')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'github') {
    container.classList.add('glarity--chatgpt--github')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'youtube') {
    container.classList.add('glarity--chatgpt--youtube')
    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
      document.querySelector('#secondary.style-scope.ytd-watch-flexy')?.prepend(container)
    })
  } else if (siteName === 'wsj') {
    console.log('debug', 'appendContainer')
    container.classList.add('glarity--chatgpt--wsj')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else {
    const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)

    console.log(
      'siderbarContainer',
      siderbarContainer,
      document.querySelector('#center_col')?.nextSibling,
    )

    if (siderbarContainer) {
      siderbarContainer.prepend(container)
    } else {
      // container.classList.add('sidebar--free')
      // const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
      // if (appendContainer) {
      //   appendContainer.appendChild(container)
      // }

      if (siteConfig.extabarContainerQuery && document.querySelector('#center_col')?.nextSibling) {
        container.classList.add('glarity--full-container')
        const appendContainer = getPossibleElementByQuerySelector(siteConfig.extabarContainerQuery)
        if (appendContainer) {
          appendContainer.appendChild(container)
        }
      } else {
        container.classList.add('sidebar--free')
        const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
        if (appendContainer) {
          appendContainer.appendChild(container)
        }
      }
    }
  }

  render(
    <ChatGPTContainer
      question={question}
      transcript={transcript}
      siteConfig={siteConfig}
      langOptionsWithLink={langOptionsWithLink}
      triggerMode={userConfig.triggerMode || 'always'}
    />,
    container,
  )
}

async function run() {
  const questionData = await getQuestion(true)
  if (questionData) mount(questionData)
}

export async function getQuestion(loadInit?: boolean) {
  const language = window.navigator.language
  const userConfig = await getUserConfig()

  const providerConfigs = await getProviderConfigs()

  console.log('providerConfigs', providerConfigs)

  // PubMed
  if (siteName === 'pubmed') {
    if (
      !/(pubmed\.ncbi\.nlm\.nih.gov\/\d{8,})|(ncbi\.nlm\.nih\.gov\/pmc\/articles\/\w+)/.test(
        location.href,
      )
    ) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const contentElement = getPossibleElementByQuerySelector(siteConfig.contentContainerQuery || [])

    document.querySelector('div#abstract-1 + #body-1')
    let articleText
    if (contentElement) {
      articleText = contentElement?.textContent
    } else {
      const eles = [
        'div#abstract-1',
        '#body-1',
        'div#sec2',
        'div#sec3',
        'div#sec4',
        'div#sec5',
        'div#sec6',
        'div#sec7',
        'div#sec8',
        'div#sec9',
        'div#sec10',
      ]

      for (let index = 0; index < eles.length; index++) {
        const text = document.querySelector(eles[index])?.textContent

        if (text) {
          articleText = articleText + ' ' + text
        }
      }
    }

    console.log('articleText', articleText)

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    console.log('content', content)

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:  ${content}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('PubMed', queryText)

    return { question: queryText, siteConfig }
  }

  // Yahoo Japan News
  if (siteName === 'yahooJpNews') {
    if (!/\/articles\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('Yahoo Japan News queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // Yahoo finance
  if (siteName === 'yf') {
    if (!/\/news\//g.test(location.href)) {
      return null
    }
    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('Yahoo finance News queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // wiki
  if (siteName === 'wiki') {
    const articleTitle = 'what is '+document.title.split(' - ')[0] || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('wiki queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // reuters
  if (siteName === 'reuters') {
    
    console.log('debug', 'query reuters')

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('reuters queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // verge
  if (siteName === 'verge') {
    console.log('debug', 'query The Verge')

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('verge queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // newspicks
  if (siteName === 'newspicks') {
    if (!/\/news\/\d+\/body\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('newspicks queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // nikkei
  if (siteName === 'nikkei') {
    if (!/nikkei\.com\/article\/\w+/g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('nikkei queryText', queryText)

    return { question: queryText, siteConfig }
  }

  //github issues
  if (siteName === 'githubIssues') {
    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Summaries the issues and provide a solution step by step if exist. Return the solution following the format below and replace your answer if find the {keywords}. If the issue is not solved, please return the reason why it is not solved.

Issue type: {issue type}

Issue: {issue}

{solution}

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('github issues queryText', queryText)

    return { question: queryText, siteConfig }
  }
  // github
  if (siteName === 'github') {
    if (!/github\.com\/\w+\/\w+/g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights in the following format. Replace the {keywords} with your answer.

{project name}
- {support platform}

{purpose}

{key features}

{installation}

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('github queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // Youtube
  if (siteName === 'youtube') {
    const videoId = getSearchParam(window.location.href)?.v

    if (!videoId) {
      return ''
    }

    // Get Transcript Language Options & Create Language Select Btns
    const langOptionsWithLink = await getLangOptionsWithLink(videoId)

    console.log('langOptionsWithLink', langOptionsWithLink)

    const transcriptList = await getConverTranscript({ langOptionsWithLink, videoId, index: 0 })

    const videoTitle = document.title
    const videoUrl = window.location.href

    const transcript = (
      transcriptList.map((v) => {
        return `${v.text}`
      }) || []
    ).join('')

    const Instructions = userConfig.prompt ? `${userConfig.prompt}` : defaultPrompt

    const queryText = `Title: ${videoTitle}
Transcript: ${getSummaryPrompt(transcript, providerConfigs.provider)}

Instructions: ${Instructions}
Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.
`

    console.log('youtube queryText', queryText)

    return {
      question: transcript.length > 0 ? queryText : '',
      siteConfig,
      transcript: transcriptList,
      langOptionsWithLink,
    }
  }

  // Bing
  if (siteName === 'bing') {
    const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
    if (!searchInput) return null
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`

    console.log('searchValueWithLanguageOption', searchValueWithLanguageOption)

    let searchList = ''

    //  Result list
    const resultList = document.querySelectorAll('main > ol > li.b_algo')
    if (resultList.length > 0) {
      for (let i = 0; i < resultList.length; i++) {
        const v = resultList[i]
        const text = v.querySelector('.b_lineclamp2')?.textContent
        const index = i + 1
        let url = v.querySelector('a.sh_favicon')?.href

        if (text && url && index <= 6) {
          url = url.replace(/https?:/, '')
          searchList =
            searchList +
            `
  [${index}] ${text}
  URL: ${url}
  
            `
        } else {
          break
        }
      }
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const queryText = `Web search results:

${getSummaryPrompt(searchList)}

Current date: ${year}/${month}/${day}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.
Query: ${searchInput.value}
Reply in ${userConfig.language === Language.Auto ? language : userConfig.language}`

    console.log('searchList', searchList)
    console.log('queryText', queryText)
    console.log('siteConfig', siteConfig)

    return {
      question: searchList ? queryText : searchValueWithLanguageOption,
      siteConfig,
    }
  }

  //Wsj
  if (siteName === 'wsj') {
    console.log('debug', 'query')
    if (!/wsj\.com\/articles\/\w+/g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('Yahoo Japan News queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // Google
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.value) {
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`

    console.log('searchValueWithLanguageOption', searchValueWithLanguageOption)

    let searchList = ''

    //  Result list
    const resultList = document.querySelectorAll('div.MjjYud')
    if (resultList.length > 0) {
      resultList.forEach((v, i) => {
        let url = ''
        let text = ''
        const index = i + 1
        let titleWrap: Element | null = null
        let title: Element | null = null

        if (v.contains(v.querySelector('block-component'))) {
          // featured snippets
          titleWrap = v.querySelector('div.yuRUbf')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          url = titleWrap?.querySelector('a')?.href || ''
          text = v.querySelector('span.ILfuVd')?.textContent || ''
        } else if (v.contains(v.querySelector('video-voyager'))) {
          // video
          titleWrap = v.querySelector('div.ct3b9e')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          // url = titleWrap?.querySelector('a')?.href || ''
          // text = v.querySelector('div.Uroaid')?.textContent || ''
          url = ''
          text = ''
        } else {
          // link
          titleWrap = v.querySelector('div.yuRUbf')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          url = titleWrap?.querySelector('a')?.href || ''
          text = v.querySelector('div.VwiC3b')?.textContent || ''
        }

        console.log(title, text, url)

        // if (title && loadInit) {
        //   const html = xss(`<span class="glarity--summary--highlight">[${index}] </span> `)
        //   title.insertAdjacentHTML('afterbegin', html)
        // }

        if (text && url && index <= 6) {
          url = url.replace(/https?:/, '')
          searchList =
            searchList +
            `
[${index}] ${text}
URL: ${url}

          `
        }
      })
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const queryText = `Web search results:

${getSummaryPrompt(searchList, providerConfigs.provider)}

Current date: ${year}/${month}/${day}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.
Query: ${searchInput.value}
Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('searchList', searchList)
    console.log('queryText', queryText)
    console.log('siteConfig', siteConfig)

    return {
      question: searchList ? queryText : searchValueWithLanguageOption,
      siteConfig,
    }
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}

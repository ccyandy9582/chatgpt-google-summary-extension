import {
  CssBaseline,
  GeistProvider,
  Radio,
  Select,
  Text,
  Toggle,
  useToasts,
  Code,
  Textarea,
  Card,
  Button,
  Snippet,
  Divider,
  Checkbox,
  Grid,
  Spacer,
  Note,
} from '@geist-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import '../base.css'
import {
  getUserConfig,
  Language,
  Theme,
  TriggerMode,
  TRIGGER_MODE_TEXT,
  updateUserConfig,
} from '../config'
import { defaultPrompt } from '../utils'
import logo from '../logo.png'
import { detectSystemColorScheme, getExtensionVersion } from '../utils'
import ProviderSelect from './ProviderSelect'
import { config as supportSites } from '../content-script/search-engine-configs'
import './styles.scss'

function CustomizePrompt() {
  return `Title: "{{Title}}"
Transcript: "{{Transcript}}"`
}

const customizePrompt1 = `Your output should use the following template:
#### Summary
#### Highlights
- [Emoji] Bulletpoint

Your task is to summarise the text I have given you in up to seven concise bullet points, starting with a short highlight. Choose an appropriate emoji for each bullet point. Use the text above: {{Title}} {{Transcript}}.
`

const customizePromptClickbait_bak = `The above is the transcript and title of a youtube video I would like to analyze for exaggeration. Based on the content, please give a Clickbait score of the title.

reply format:
#### Clickbait score

#### Explanation`

const customizePromptClickbait = `What is the clickbait likelihood of the title and transcript for this video? Please provide a score and a brief explanation for your score, the clickbait score is up to 10, if the clickbait score is less than 5 then answer: 👍 Clickbait Score : Low, otherwise answer: 👎 Clickbait Score : High.

Example response:
> The lower the Clickbait score, the better.
#### Clickbait Score:
👍 Clickbait Score : Low or 👎 Clickbait Score : High
#### Explanation:
The title is a bit exaggerated.
`

function OptionsPage(props: { theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)
  const [language, setLanguage] = useState<Language>(Language.Auto)
  const { setToast } = useToasts()
  const [prompt, setPrompt] = useState<string>('')
  const [allSites, setAllSites] = useState([])
  const [enableSites, setEnableSites] = useState([])
  const [allSelect, setAllSelect] = useState(true)

  const onTriggerModeChange = useCallback(
    (mode: TriggerMode) => {
      setTriggerMode(mode)
      updateUserConfig({ triggerMode: mode })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const onThemeChange = useCallback(
    (theme: Theme) => {
      updateUserConfig({ theme })
      props.onThemeChange(theme)
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [props, setToast],
  )

  const onLanguageChange = useCallback(
    (language: Language) => {
      updateUserConfig({ language })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const onPromptChange = useCallback((e) => {
    const prompt = e.target.value || ''
    setPrompt(prompt)
  }, [])

  const onSavePrompt = useCallback(() => {
    updateUserConfig({ prompt })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [setToast, prompt])

  const onSetPrompt = useCallback(() => {
    setPrompt(defaultPrompt)
    updateUserConfig({ prompt: defaultPrompt })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [setToast])

  CustomizePrompt

  const getSplitString = (str: string) => {
    if (str && str.includes('Chinese')) {
      return `Chinese (${str.split('Chinese')[1] || ''})`
    }

    return str ?? ''
  }

  const onSaveSelect = useCallback(() => {
    updateUserConfig({ enableSites })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [setToast, enableSites])

  const onChangeSites = (value) => {
    console.log(value)
    setEnableSites(value)
  }

  const onChangeSelectAll = (e) => {
    console.log(e)

    if (e.target.checked) {
      setEnableSites(allSites)
    } else {
      setEnableSites([])
    }
  }

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
      setLanguage(config.language)

      setPrompt(config.prompt ? config.prompt : defaultPrompt)

      const sites =
        Object.values(supportSites).map((site) => {
          return site.siteValue
        }) || []

      console.log('sites', sites)
      setAllSites(sites)
      setEnableSites(config.enableSites ? config.enableSites : sites)
    })
  }, [])

  useEffect(() => {
    if (enableSites.length === allSites.length) {
      setAllSelect(true)
    } else {
      setAllSelect(false)
    }
  }, [enableSites, allSites])

  return (
    <div className="container mx-auto">
      <nav className="flex flex-row justify-between items-center mt-5 px-2">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-lg" />
          <span className="font-semibold">
            Glarity-Summary for Google/YouTube (ChatGPT) (v
            {getExtensionVersion()})
          </span>
        </div>
        <div className="flex flex-row gap-3">
          {/* <a href="https://chatgpt-for-google.canny.io/changelog" target="_blank" rel="noreferrer">
            Changelog
          </a> */}
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          <a href="https://twitter.com/Glarity_summary" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </div>
      </nav>
      <main className="w-[900px] mx-auto mt-14">
        <Text h2>Options</Text>
        <Text h3 className="mt-5">
          Trigger Mode
        </Text>
        <Radio.Group
          value={triggerMode}
          onChange={(val) => onTriggerModeChange(val as TriggerMode)}
        >
          {Object.entries(TRIGGER_MODE_TEXT).map(([value, texts]) => {
            return (
              <Radio key={value} value={value}>
                {texts.title}
                <Radio.Description>{texts.desc}</Radio.Description>
              </Radio>
            )
          })}
        </Radio.Group>
        <Text h3 className="mt-5">
          Theme
        </Text>
        <Radio.Group value={props.theme} onChange={(val) => onThemeChange(val as Theme)} useRow>
          {Object.entries(Theme).map(([k, v]) => {
            return (
              <Radio key={v} value={v}>
                {k}
              </Radio>
            )
          })}
        </Radio.Group>
        <Text h3 className="mt-5 mb-0">
          Language
        </Text>
        <Text className="my-1">
          The language used in ChatGPT response. <span className="italic">Auto</span> is
          recommended.
        </Text>
        <Select
          value={language}
          placeholder="Choose one"
          onChange={(val) => onLanguageChange(val as Language)}
        >
          {Object.entries(Language).map(([k, v]) => (
            <Select.Option key={k} value={v}>
              {getSplitString(String(k))}
            </Select.Option>
          ))}
        </Select>

        <Text h3 className="mt-5 mb-0">
          AI Provider
        </Text>
        <ProviderSelect />

        <Text h3 className="mt-5 mb-0">
          Customize Prompt for Summary(YouTube)
        </Text>
        <Card className="glarity--card">
          <Text className="my-1">
            <Code block my={0}>
              <CustomizePrompt />
            </Code>
          </Text>

          <Textarea
            placeholder="Please enter a Prompt."
            value={prompt}
            resize={'vertical'}
            onChange={onPromptChange}
          />
          {/* <Divider /> */}
          <Card.Footer>
            <Button type="secondary" auto scale={1 / 3} onClick={onSavePrompt}>
              Save
            </Button>{' '}
            <Button type="secondary" ghost auto scale={1 / 3} onClick={onSetPrompt}>
              Use default
            </Button>
          </Card.Footer>
        </Card>
        <Text className="my-1">Example Prompts: </Text>
        <ul>
          <li>
            <Snippet symbol="" type="secondary">
              Summarize the above content highlights.{' '}
            </Snippet>
          </li>
          <li>
            {' '}
            <Snippet symbol="" type="secondary">
              Summarize the above in 3 bullet points.{' '}
            </Snippet>
          </li>
          <li>
            {' '}
            <Snippet symbol="" type="secondary">
              What's key takeaways from the above?{' '}
            </Snippet>
          </li>
          <li>
            <Snippet type="secondary">Extract the gist of the above.</Snippet>
          </li>
          <li>
            <Snippet symbol="" type="secondary">
              {customizePrompt1}
            </Snippet>
          </li>
          <li>
            <Snippet symbol="" type="success">
              {customizePromptClickbait}
            </Snippet>
          </li>
        </ul>

        <Text h3 className="mt-5">
          Enable/Disable Glarity
          <Text font="12px" my={0}>
            You can enable/disable the Glarity Summary on the following website.
          </Text>
        </Text>

        <Card>
          {/* <Card.Content py={0}></Card.Content>
          <Divider /> */}
          <Card.Content>
            <Checkbox.Group
              value={enableSites}
              onChange={onChangeSites}
              className="glarity--support__sites"
            >
              {Object.entries(supportSites).map(([k, v]) => {
                return (
                  <Checkbox key={k} value={v.siteValue} className="glarity--support__sites--item">
                    {v.siteName}
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </Card.Content>
          <Card.Footer>
            <Checkbox checked={allSelect} value="selectAll" onChange={onChangeSelectAll}>
              Select All / Reverse
            </Checkbox>
            <Spacer w={2} />
            <Button type="secondary" auto scale={1 / 3} onClick={onSaveSelect}>
              Save
            </Button>
          </Card.Footer>
        </Card>

        <Text h3 className="mt-8">
          Misc
        </Text>
        <div className="flex flex-row items-center gap-4">
          <Toggle initialChecked disabled />
          <Text b margin={0}>
            Auto delete conversations generated by search
          </Text>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(Theme.Auto)

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => setTheme(config.theme))
  }, [])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <OptionsPage theme={theme} onThemeChange={setTheme} />
    </GeistProvider>
  )
}

export default App

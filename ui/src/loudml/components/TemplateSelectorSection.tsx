import React, {Component} from 'react'

import classnames from 'classnames'
import { getTemplates } from '../apis';
import { RemoteDataState } from 'src/types';
import LoadingDots from 'src/shared/components/LoadingDots';

import 'src/loudml/styles/template.scss'

interface TemplateDescription {
  name: string
  params: string[]
  short_desc: string
  long_desc: string
}

interface Props {
  name: string
  onChooseTemplate: (name: string, params: string[]) => void
}

interface State {
  templates: TemplateDescription[]
  templatesStatus: RemoteDataState
}

class TemplateSelectorSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      templates: [],
      templatesStatus: RemoteDataState.Loading,
    }
  }

  public async componentDidMount() {
    await this.loadTemplates()
  }

  public render() {

    return (
      <div className="rule-section">
        <h3 className="rule-section--heading">Choose a template</h3>
        <div className="rule-section--body">
          <div className="rule-section--row rule-section--row-first rule-section--row-last">
            {this.renderTemplates}
            {/* <RadioButtons
              activeButton={name.trigger}
              buttons={[TemplateTypeTabs.Syslog, TemplateTypeTabs.Other]}
              onChange={onChooseTrigger}
              shape={ButtonShape.Default}
              size={ComponentSize.Small}
              disabled={true}
              /> */}
          </div>
        </div>
      </div>
    )
  }

  private onChangeCellName = (name: string) => () => {
    const {onChooseTemplate} = this.props
    const {templates} = this.state
    const template = templates.find(t => (t.name===name))
    onChooseTemplate(template.name, template.params)
  }

  private loadTemplates = async (): Promise<void> => {

    this.setState({templatesStatus: RemoteDataState.Loading})

    try {
      const {templates} = await getTemplates()

      this.setState({
        templatesStatus: RemoteDataState.Done,
        templates: templates.map(template => ({
          name: template.name,
          params: template.params,
          short_desc: template.short_desc,
          long_desc: template.long_desc,
        })),
      })
    } catch (error) {
      this.setState({
        templatesStatus: RemoteDataState.Done,
        templates: TEMPLATES.map(template => ({
          name: template.name,
          params: template.params,
          short_desc: template.short_desc,
          long_desc: template.long_desc,
        })),
      })
      // this.setState({templatesStatus: RemoteDataState.Error})
      // console.error(error)
    }
  }

  private get renderTemplates() {
    const {
      templates,
      templatesStatus,
    } = this.state
    const {
      name,
    } = this.props

    if (templatesStatus === RemoteDataState.Loading) {
      return (
        <LoadingDots className="query-editor--loading" />
      )
    }

    if (templatesStatus === RemoteDataState.Error) {
      return (
        <div><p>Fail to get templates</p></div>
      )
    }

    return (
      <div className="template-type-selector">
      {templates.map(template => (
        <div
          key={template.name}
          className={classnames('template-type-selector--option', {
            active: template.name === name,
          })}
        >
          <div onClick={this.onChangeCellName(template.name)}>
            <div className="template-type-selector--graphic">
            {TEMPLATE_GRAPHIC}
            </div>
            <p className="template--short-desc">{template.short_desc}</p>
            <p className="template--long-desc">{template.long_desc}</p>
          </div>
        </div>
      ))}
      </div>
    )

  }
}

const TEMPLATES = [
  {
    "long_desc": "Creates a baseline on the count of logs for given hosts. This model triggers anomalies if the number becomes too low or too high.",
    "name": "telegraf_syslog",
    "params": [
      "host",
      "name"
    ],
    "settings": {},
    "short_desc": "Detect anomalies in Syslog message counts"
  },
  {
    "long_desc": "Creates a baseline on the count of logs for given hosts. This model triggers anomalies if the number becomes too low or too high.",
    "name": "telegraf_nginx",
    "params": [
      "host",
      "name"
    ],
    "settings": {},
    "short_desc": "Detect anomalies in Nginx message counts"
  },
]

const TEMPLATE_GRAPHIC = (
  <svg
    version="1.1"
    x="0"
    y="0"
    width="150"
    height="150"
    viewBox="0, 0, 303.278, 480.459">
  <g id="Layer_2">
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M137.24,18.519 C132.134,18.519 127.98,14.365 127.98,9.26 C127.98,4.154 132.134,0 137.24,0 C142.346,0 146.5,4.154 146.5,9.26 C146.5,14.365 142.346,18.519 137.24,18.519"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M172.638,43.444 C165.885,43.444 160.392,37.949 160.392,31.197 C160.392,24.445 165.885,18.95 172.638,18.95 C179.39,18.95 184.884,24.445 184.884,31.197 C184.884,37.949 179.39,43.444 172.638,43.444"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M146.763,57.931 C143.238,57.931 140.372,55.065 140.372,51.541 C140.372,48.016 143.238,45.15 146.763,45.15 C150.287,45.15 153.154,48.016 153.154,51.541 C153.154,55.065 150.287,57.931 146.763,57.931"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-bottle"
      d="M82.492,89.847 C82.492,76.718 91.546,66.036 104.016,63.306 C106.053,62.842 108.421,62.597 110.623,62.597 L192.887,62.597 C208.53,62.597 220.783,74.566 220.783,89.847 C220.783,100.556 214.745,109.646 205.74,114.086 C204.669,114.631 203.408,115.131 202.255,115.535 C201.129,115.93 199.928,116.395 198.735,116.645 C198.192,116.776 197.644,116.895 197.089,117.001 C196.089,120.532 194.49,129.173 193.959,149.217 C193.553,164.515 194,178.615 194.005,178.773 L194.014,178.993 L194.011,179.214 C194.005,179.728 193.667,221.122 209.606,248.869 C259.301,335.374 282.775,380.992 293.758,405.595 C303.138,426.621 303.233,431.959 303.263,434.959 L303.269,435.63 C303.28,436.739 303.28,437.837 303.271,438.933 C303.269,439.155 303.266,439.404 303.263,439.626 C303.139,449.506 302.085,460.027 292.995,468.039 C283.254,476.625 265.84,480.459 236.59,480.459 L66.81,480.459 C65.74,480.459 64.563,480.453 63.526,480.442 C36.175,480.172 19.666,476.31 10.282,468.04 C1.199,460.033 0.139,449.524 0.014,439.65 C0.011,439.423 0.009,439.171 0.007,438.946 C-0.002,437.845 -0.002,436.744 0.008,435.631 L0.013,434.962 C0.043,431.959 0.136,426.614 9.547,405.529 C20.543,380.911 44.02,335.296 93.67,248.869 C109.69,220.984 109.272,179.62 109.266,179.206 L109.263,178.987 L109.269,178.766 C109.277,178.561 109.721,164.487 109.316,149.217 C108.784,129.148 107.182,120.505 106.18,116.98 C105.81,116.91 105.442,116.834 105.078,116.752 C103.855,116.521 102.622,116.071 101.469,115.688 C100.279,115.294 98.984,114.802 97.881,114.259 C88.684,109.879 82.492,100.693 82.492,89.847 z M100.785,89.847 C100.785,94.829 104.761,98.607 110.055,98.707 C113.251,98.769 116.321,100.105 118.728,102.45 C119.694,103.392 120.656,104.583 121.56,106.291 C124.374,111.652 126.786,122.128 127.548,146.838 C128.035,162.595 127.62,177.178 127.56,179.159 C127.56,179.215 127.56,179.288 127.561,179.36 C127.589,184.096 127.327,223.785 111.523,254.322 C110.862,255.601 110.17,256.87 109.45,258.125 C101.146,272.581 79.877,309.609 59.782,346.845 C58.834,348.6 57.889,350.356 56.949,352.111 C30.383,401.64 21.659,422.545 19.264,430.669 C19.186,430.926 19.112,431.2 19.045,431.431 C18.449,433.537 18.301,434.68 18.292,435.293 L18.292,435.964 C18.294,445.621 18.496,450.895 22.378,454.316 C28.285,459.523 43.125,462.157 66.579,462.166 L236.695,462.166 C260.15,462.157 274.991,459.523 280.898,454.316 C284.779,450.897 284.982,445.624 284.984,435.97 L284.984,435.292 C284.973,434.662 284.818,433.474 284.181,431.256 C284.116,431.039 284.047,430.78 283.972,430.541 C281.531,422.34 272.762,401.399 246.336,352.129 C245.31,350.213 244.278,348.297 243.244,346.382 C223.239,309.334 202.124,272.569 193.846,258.16 C192.956,256.61 192.111,255.04 191.311,253.455 C175.714,222.587 175.683,182.887 175.716,179.168 C175.715,179.112 175.713,179.036 175.71,178.96 C175.632,176.354 175.254,162.15 175.727,146.838 C176.502,121.723 178.981,111.306 181.858,106.023 C182.715,104.461 183.622,103.344 184.534,102.451 C184.628,102.358 184.723,102.267 184.82,102.178 C187.184,99.999 190.15,98.768 193.225,98.705 C198.517,98.604 202.492,94.827 202.492,89.847 C202.492,84.746 198.357,80.89 192.888,80.89 L117.397,80.89 C117.289,80.89 110.182,80.916 110.096,80.963 C104.779,81.059 100.786,84.849 100.786,89.847"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M168.518,102.377 C165.041,102.377 162.213,99.549 162.213,96.072 C162.213,92.595 165.041,89.767 168.518,89.767 C171.995,89.767 174.823,92.595 174.823,96.072 C174.823,99.549 171.995,102.377 168.518,102.377"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M142.45,125.609 C138.915,125.609 136.038,122.733 136.038,119.197 C136.038,115.661 138.915,112.785 142.45,112.785 C145.986,112.785 148.862,115.661 148.862,119.197 C148.862,122.733 145.986,125.609 142.45,125.609"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M159.888,162.061 C155.212,162.061 151.407,158.257 151.407,153.58 C151.407,148.904 155.212,145.1 159.888,145.1 C164.564,145.1 168.369,148.904 168.369,153.58 C168.369,158.257 164.564,162.061 159.888,162.061"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M146.763,220.426 C140.779,220.426 135.91,215.557 135.91,209.572 C135.91,203.587 140.779,198.718 146.763,198.718 C152.747,198.718 157.617,203.587 157.617,209.572 C157.617,215.557 152.747,220.426 146.763,220.426" fill="#000000" id="path62440"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M168.518,260.604 C164.158,260.604 160.611,257.056 160.611,252.697 C160.611,248.337 164.158,244.789 168.518,244.789 C172.878,244.789 176.425,248.337 176.425,252.697 C176.425,257.056 172.878,260.604 168.518,260.604"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M133.638,297.733 C127.76,297.733 122.977,292.951 122.977,287.072 C122.977,281.194 127.76,276.412 133.638,276.412 C139.515,276.412 144.298,281.194 144.298,287.072 C144.298,292.951 139.515,297.733 133.638,297.733"
      />
    <path
      className="template-type-selector--graphic-fill graphic-fill-a"
      d="M85.245,318.126 C86.159,317.255 90.937,314.164 95.434,313.083 C96.488,312.83 97.547,312.697 98.557,312.721 C100.65,312.77 102.877,313.588 105.325,314.764 C109.807,316.913 115.076,320.248 121.778,322.162 C123.681,322.707 125.979,322.859 128.564,322.72 C137.558,322.242 149.929,318.235 160.398,315.152 C163.556,314.222 166.54,313.377 169.205,312.739 C170.522,312.423 171.961,312.217 173.49,312.109 C175.185,311.989 177.024,311.992 178.966,312.098 C192.834,312.871 211.335,318.808 218.499,320.941 C218.99,321.087 219.426,321.215 219.805,321.322 C262.591,398.661 274.155,426.885 276.064,434.014 C276.598,436.008 276.482,439.582 276.39,441.965 C276.381,442.155 276.376,442.34 276.37,442.52 C276.281,444.734 275.32,446.875 273.809,448.32 C273.713,448.406 273.614,448.516 273.513,448.597 C272.775,449.259 271.88,449.784 270.879,450.104 C261.414,453.136 247.077,453.661 236.588,453.661 L66.688,453.661 C56.222,453.661 41.866,453.138 32.398,450.105 C31.405,449.787 30.519,449.265 29.783,448.612 C28.088,447.106 26.994,444.789 26.912,442.461 C26.754,437.896 26.79,435.565 27.21,433.975 C29.343,426.028 36.422,405.436 85.245,318.125"/>
  </g>
</svg>
)
export default TemplateSelectorSection
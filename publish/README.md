# mt-waterfall

A light-weight React mt-waterfall component with extremely easy API（只适用于移动端项目）. [Online Demo](https://shenxuxiang.github.io/mt-waterfall/), welcome [code review](https://github.com/shenxuxiang/mt-waterfall)

## Installation
```sh
npm install mt-waterfall --save
```

## Usage Waterfall
```js
import React, { PureComponent } from 'react';
import img1 from './static/images/11.jpg';
import img2 from './static/images/12.jpg';
import img3 from './static/images/13.jpg';
import img4 from './static/images/14.jpg';
import img5 from './static/images/15.jpg';
import img6 from './static/images/16.png';
import Waterfall from './waterfall';
import './app.css';
import GoodsList from './goodsList';
const source = [
  {
    url: img1,
    text: '精选',
    label: '11',
  },
  {
    url: img2,
    text: '良品铺子',
    label: '22',
  },
  {
    url: img3,
    text: '乳饮酒水',
    label: '33',
  },
  {
    url: img4,
    text: '粮油米面',
    label: '44',
  },
  {
    url: img5,
    text: '纸品家清',
    label: '55',
  },
  {
    url: img6,
    text: '休闲食品',
    label: '66',
  },
  {
    url: img1,
    text: '时令生鲜',
    label: '77',
  },
  {
    url: img2,
    text: '美容个理',
    label: '88',
  },
];

export default class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      navSource: [],
    };
    this.fixed = false;
  }

  componentDidMount() {
    this.setState({navSource: source});
  }

  renderNavItem = (item, index) => {
    return (
      <div
        key={index}
        className="nav-list-item"
      >
        <img src={item.url} className="nav-list-item-img" />
        <div className="nav-list-item-text">{item.text}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <Waterfall
          renderNavItem={this.renderNavItem}
          navSource={this.state.navSource}
          waterfallTemplate={GoodsList}
          extraKey="label"
          tabIndex={0}
          navBackground='#f90'
          className="waterfall"
          navClassName="waterfall-header"
        />
      </div>
    );
  }
}
```

## props

| param                | detail                                                                            | type     | default      |
| -------------------- | --------------------------------------------------------------------------------- | -------- | ------------ |
| className            | waterfall class name                                                              | string   | ''           |
| waterfallTemplate    | waterfall content template                                                        | function | isRequired   |
| navSource            | navigation list of waterfalls                                                     | array    | []           |
| extraKey             | distinguish the unique key of the navSource array element                         | string   | isRequired   |
| navBackground        | navigation background color                                                       | string   | ''           |
| navClassName         | navigation class name                                                             | string   | ''           |
| renderNavItem        | waterfall navigation list item content template                                   | function | isRequired   |
| tabIndex             | the first few tabs are displayed when the waterfall is initially rendered         | number   | 0            |
| loadingText          | the content displayed by loading when the waterfall is pulled up and loaded       | string   | 努力加载中     |
| loadingCompletedText | the content displayed by loading when the waterfall flow is loaded                | string   | 上拉加载更多信息|
| notMoreText          | when the waterfall pulls up and loads all the data, loading the displayed content | string   | 我也是有底线的 |
| showLoading          | hide or show loading tips                                                         | bool     | true         |
| propName             | any                                                                               | any      |              |



## Usage waterfallTemplate

```js
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { request } from '../constant';
import Image from 'mt-lazy-image';
import './index.less';

export default class GoodsList extends PureComponent {
  static propTypes = {
    navItem: PropTypes.object,
    loadingState: PropTypes.oneOf([
      'LOADING',
      'DONE',
      'NOTMORE',
    ]),
    onLoadEnd: PropTypes.func,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    navItem: {},
    loadingState: 'DONE',
    onLoadEnd: () => {},
    visible: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      source: [],
    }
    this.offset = 0;
  }

  componentDidMount() {
    if (this.props.visible && this.state.source.length <= 0) {
      // 如果当前这个类目的 GoodsList 是显示的，且 goodslist 是空的
      // 就可以调用 onLoadEnd 回调函数，修改父组件的 loadingState
      // 回调函数接受的 value 是 string 类型；只有三个值： DONE、LOADING、NOTMORE
      // 当父组件执行 onLoadEnd 完成后，就会触发当前组件的 WillReceiveProps 
      this.props.onLoadEnd('LOADING');
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (
      nextProps.loadingState === 'LOADING' && 
      nextProps.loadingState !== this.props.loadingState
    ) {
      // 如果父组件的 loadingState 由其他值转变成 LOADING 的话
      // 我们可以理解为组件正在进行加载
      // 每当数据加载完成后，都需要调用一下 props.onLoadEnd('DONE') 或 props.onLoadEnd('NOTMORE'); 
      // 通知父组件加载完成了
      this.handleLoadMore();
    }

    if (
      nextProps.visible &&
      !this.props.visible &&
      this.state.source.length <= 0
    ) {
      this.props.onLoadEnd('LOADING');
    }
  }

  handleLoadMore = () => {
    request({ offset: this.offset, activity_id: this.props.navItem.label })
      .then(data => {
        this.setState(prevState => ({ source: prevState.source.concat(...data.items)}));

        this.offset = data.offset;
        if (!data.offset || data.items.length <= 0) {
          this.props.onLoadEnd('NOTMORE');
        } else {
          this.props.onLoadEnd('DONE');
        }
      })
      .catch(() => {
        this.props.onLoadEnd('DONE');
      });
  }

  render() {
    const { source } = this.state;
    return (
      <ul className="mt-goods-list">
        {
          source.map(item =>
            <li className="mt-goods-list-item" key={item.goods_id}>
              <Image 
                src={item.url}
                alt="商品图片"
                className="mt-goods-list-item-avator"
              />
              <div className="mt-goods-list-item-name">{item.name}</div>
              <div className="mt-goods-list-item-price">{(item.price / 100 || 0).toFixed(2)}</div>
              <div className="mt-goods-list-item-button">去抢购</div>
            </li>
          )
        }
      </ul>
    );
  }
}
```

## props

| param           | detail                                              | type     | default     |
| --------------- | --------------------------------------------------- | -------- | ----------- |
| navItem         | information of the selected navigation list item    | object   | ''          |
| loadingState    | pull-up loading status                              | string   | One of DONE, LOADING, NOTMORE, the default value is DONE  |
| onLoadEnd       | the callback when the pull-up loading is completed  | array    | []          |
| visible         | hide or show                                        | boolean  | false       |
| propName        | accept the props of the waterfall component         | any      |             |

## 注意

`Waterfall` 组件接受的任何 `props` 都可以在 `waterfallTemplate` 组件中获取到
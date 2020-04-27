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
    this.containRef = React.createRef(null);
  }

  componentDidMount() {
    this.setState({navSource: source});
  }
  componentWillUnmount() {
  }

  renderNavItem = (item) => {
    return (
      <div
        key={item.label}
        className="nav-list-item"
      >
        <img src={item.url} className="nav-list-item-img" />
        <div className="nav-list-item-text">{item.text}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="container"  ref={this.containRef}>
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

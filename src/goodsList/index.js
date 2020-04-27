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
  }

  static defaultProps = {
    navItem: {},
    loadingState: 'DONE',
    onLoadEnd: () => {},
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
      this.props.onLoadEnd('LOADING');
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (
      nextProps.loadingState === 'LOADING' && 
      nextProps.loadingState !== this.props.loadingState
    ) {
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
        this.setState(prevState => ({ source: prevState.source.concat(...data.items) || prevState.source }));

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


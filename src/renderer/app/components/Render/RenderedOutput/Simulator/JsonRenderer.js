import React from 'react';
import "./JsonRenderer.css"
class JsonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: props.depth != 0 };
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
  };

  render() {
    const { data, keyPrefix, depth } = this.props;
    const { collapsed } = this.state;
    const expandedEnder = "]"
    return (
      <div key={keyPrefix} className='json-list'>
        <span onClick={this.toggleCollapse} style={{ cursor: 'pointer', color: 'orange' }}>
          {collapsed ? '[ ... ]' : '['}
        </span>
        {!collapsed && 
            <React.Fragment>
                <ul>
                    {data.map((item, index) => (
                    <li key={`${keyPrefix}-${index}`}>
                        {renderElement(item, depth+1, `${keyPrefix}-${index}`)}
                    </li>
                    ))}
                </ul>
                <span onClick={this.toggleCollapse} style={{ cursor: 'pointer', color: 'orange' }}>{expandedEnder}</span>
            </React.Fragment>
        }
        
      </div>
    );
  }
}

class JsonObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: props.depth != 0 };
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
  };

  render() {
    const { data, keyPrefix,depth } = this.props;
    const { collapsed } = this.state;
    const expandedEnder = "}"
    return (
      <div key={keyPrefix} className='json-object'>
        <span onClick={this.toggleCollapse} style={{ cursor: 'pointer', color: 'orange' }}>
          {collapsed ? '{ ... }' : '{'}
        </span>
        {!collapsed && <React.Fragment>
            {Object.keys(data).map((key) => (
              <div key={`${keyPrefix}-${key}`} style={{ marginLeft: '20px', width:"100%" }}>
                <strong>{key}:</strong> {renderElement(data[key], depth+1, `${keyPrefix}-${key}`)}
              </div>
            ))}
            <span onClick={this.toggleCollapse} style={{ cursor: 'pointer', color: 'orange' }}>{expandedEnder}</span>
        </React.Fragment>}
      </div>
    );
  }
}

const renderElement = (data, depth, keyPrefix = '') => {
  if (data === null) {
    return <span key={keyPrefix}>null</span>;
  }

  if (Array.isArray(data)) {
    return <JsonList data={data} depth={depth+1} keyPrefix={keyPrefix} />;
  }

  if (typeof data === 'object') {
    return <JsonObject data={data} depth={depth+1} keyPrefix={keyPrefix} />;
  }

  if (typeof data === "string" && data.length > 50) {
    return <span key={keyPrefix} className='json-value'>{data.toString().substring(0, 50)}...</span>; 
  }
  return <span key={keyPrefix} className='json-value'>{data.toString()}</span>;
};

export default class JsonRenderer extends React.Component {
  render() {
    return <div className='json-data'>{renderElement(this.props.json, -1)}</div>;
  }
}

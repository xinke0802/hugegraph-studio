/**
 * @file Desciption:
 * @author huanghaiping(huanghaiping02@baidu.com)
 * Created on 17/7/20
 */
import React from 'react';
import {connect} from 'react-redux';
import {Tabs, TabPane} from '../commoncomponents/tabs';
import Graph from './graph';
import Code from './code';
import TableResult from './table';
import {updateItem} from './actions';

export const TABLE = 'TABLE';
export const RAW = 'RAW';
export const GRAPH = 'GRAPH';


class GremlinResult extends React.Component {
    constructor() {
        super();
        this.state = {
            tabs: []
        }

        this.curTabs = [];

    }

    componentWillReceiveProps(nextProps) {
        let tabs = this.getTabs(nextProps.content, nextProps.defaultTabKey);
        this.setState({tabs: tabs});
    }

    render() {
        let tabPanes = this.state.tabs.map((tab, index) => {
            if (tab.type === GRAPH) {
                return <TabPane key={index}>
                    <Graph id={this.props.cellId + '_graph'}
                           content={this.props.content}
                           height={this.props.height}
                           cellId={this.props.cellId}
                           notebookId={this.props.notebookId}/>
                </TabPane>
            } else if (tab.type === TABLE) {
                return <TabPane key={index}>
                    <TableResult content={this.props.content}
                                 height={this.props.height}
                                 cellId={this.props.cellId}/>
                </TabPane>
            } else {
                return <TabPane key={index}>
                    <Code id={this.props.cellId + '_code'}
                          content={this.props.content}
                          height={this.props.height}
                          cellId={this.props.cellId}/>
                </TabPane>
            }
        });

        return (
            <Tabs tabs={this.state.tabs}
                  loading={this.loading}
                  onChangeTab={this.onChangeTab}>
                {tabPanes}
            </Tabs>
        );
    }

    componentDidUpdate() {
        if (this.state.tabs.length === 0) {
            this.loadDone();
        }
    }


    componentDidMount() {
        let tabs = this.getTabs(this.props.content, this.props.defaultTabKey);
        if (tabs.length === 0) {
            this.loadDone();
        }
        this.setState({tabs: tabs});
    }

    loadDone = () => {
        let loadingId = this.props.cellId + '_loading';
        document.getElementById(loadingId).style.display = 'none';
    }

    loading = () => {
        let loadingId = this.props.cellId + '_loading';
        document.getElementById(loadingId).style.display = 'block';
    }

    onChangeTab = (type, tabs) => {
        let notebookId = this.props.notebookId;
        let cellId = this.props.cellId;

        this.curTabs = tabs;

        let cell = {
            'id': cellId,
            'viewSettings': {
                ...this.props.viewSettings,
                'viewType': type
            }
        }
        this.props.updateCell(notebookId, cellId, cell);
    }

    getTabs = (content, defaultTabKey) => {
        let nextTabs = [];
        switch (content.type) {
            case 'NUMBER':
                nextTabs = [{
                    type: TABLE,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-table'
                }, {
                    type: RAW,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-code'
                }];
                break;
            case 'EMPTY':
                nextTabs = [{
                    type: RAW,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-code'
                }];
                break;
            case 'EDGE':
            case 'VERTEX':
            case 'PATH':
                nextTabs = [{
                    type: TABLE,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-table'
                }, {
                    type: GRAPH,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-joomla'
                }, {
                    type: RAW,
                    isActive: false,
                    exist: false,
                    label: 'fa fa-code'
                }];
                break;
            default:
                nextTabs = [];
        }


        // use the current tabs and the defaultTabKey to identify the nextTabs;
        // the current tabs keep the state of tabs now，which can be changed
        // by the function "onChangeTab"
        this.curTabs.forEach(curTab => {
            nextTabs = nextTabs.map(nextTab => {
                if (nextTab.type === curTab.type) {
                    nextTab.exist = curTab.exist;
                }
                return nextTab;
            })
        });


        // according the current selected tabKey to identify next default Tab;
        // details as follows:
        // (1) if defaultTabKey === 1 ,next default tab is nextTabs[0]
        // (2) if defaultTabKey !==1 and the new resultTabs contain this type
        //         next default tab is  the current selected tabKey
        //     else
        //         next default tab is nextTabs[0]
        if (nextTabs.length > 0) {
            if (defaultTabKey === 1) {
                nextTabs[0].isActive = true;
                nextTabs[0].exist = true;
            } else {
                let isExistDefaultTabKey = false;
                nextTabs = nextTabs.map(tab => {
                    if (tab.type === defaultTabKey) {
                        tab.isActive = true;
                        tab.exist = true;
                        isExistDefaultTabKey=true;
                    }
                    return tab;
                })
                if(!isExistDefaultTabKey){
                    nextTabs[0].isActive = true;
                    nextTabs[0].exist = true;
                }
            }
        }

        return nextTabs;
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {};
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        updateCell: (notebookId, cellId, cell) => dispatch(updateItem(notebookId, cellId, cell))
    };
}

// Connected Component
export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(GremlinResult);
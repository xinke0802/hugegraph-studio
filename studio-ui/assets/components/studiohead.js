/**
 * @file Desciption
 * @author liunanke(liunanke@baidu.com)
 * Created on 2017/6/1.
 */
import '../vendors/bootstrap/css/bootstrap.min.css';
import '../css/main.css';
import React from 'react';
import Schema from './notebook/schema';
import AlertList from './connection/alertlist';


export default class StudioHead extends React.Component {

    constructor() {
        super();
        this.state = {
            showSchema: false
        };
    }

    render() {
        let display = this.props.display === undefined ? 'block' : this.props.display;
        let name = this.props.name === undefined ? 'HugeGraph Notebook Quick Start' : this.props.name;
        let headRight = this.props.connection === undefined ? null
            : <div className="header-control-right">
                <div className="graphName">
                    <i className="fa fa-database" aria-hidden="true"> </i>
                    &nbsp;{this.props.connection.graphName}
                </div>
                <div className="schema-bt">
                    <ul className="nav nav-pills">
                        <li role="presentation">
                            <a onClick={this.showSchemaView}>
                                <i className="fa fa-share-alt"
                                   aria-hidden="true"></i> Schema</a>
                        </li>
                    </ul>
                </div>
            </div>;
        let schemaView = null;
        if (this.props.connection !== undefined && this.state.showSchema) {
            schemaView = <div className="schema-view"
                              style={{display: this.state.showSchema ? 'block' : 'none'}}>
                <Schema connection={this.props.connection}/>
            </div>;
        }
        ;


        return (
            <div style={{display: display}}>
                <div className="studio-header">
                    <div className="container">
                        <div className="row">
                            <div className="header-title">
                                <h1><i className="fa fa-book"
                                       aria-hidden="true"></i>{name}</h1>
                            </div>
                            {headRight}

                        </div>
                    </div>
                </div>
                {schemaView}

                <div className="container">
                    <div className="row" style={{padding: '0 15px'}}>
                        <AlertList/>
                    </div>
                </div>
            </div>
        );
    }

    showSchemaView = () => {
        this.setState({showSchema: !this.state.showSchema});
    }
}

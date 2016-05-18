import React from 'react';
import ReactDom from 'react-dom';
import Graphiql from 'graphiql';
import GraphiqlCSS from 'graphiql/graphiql.css';
// import fetch from 'isomorphic-fetch';

function fetcher (params){
  return fetch('/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then( res => res.json() );
}

ReactDom.render(<Graphiql fetcher={fetcher} />, document.getElementById('hello'));

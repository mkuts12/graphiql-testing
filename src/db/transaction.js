import pg from 'pg';
import params from '../../database.json';
import { curry, compose } from 'ramda';

// export default class Transaction {
//   let tran;
//   constructor( tran ){
//     this.tran = tran;
//   }
//   of( sql ) {
//     return new Transaction( sql.split() )
//   }
// }

function defined ( obj ){
  return obj;
}

function appendParamsToError( err,  ){
  console.error( string );
  return {
    status: 'error',
    description: error.message,
    client, 
    done,
  };
}

function connect () {
  let connstring = `pg://${ params.user }:${ params.password }
    @${ params.host }:${ params.port }/${ params.database }`;
  return new Promise(( res, rej ) => {
    pg.connect( connstring, ( err, client, done ) => {
      if( defined(err) ){
        reject( err );
      }
      resolve({
        client,
        done,
      });
    } );
  });
}

function begin ({ client, done }){
  return new Promise( ( res, rej ) => {
    client.query('begin', ( err, result ) => {
      if( defined(err) ){
        rej( Object.assign( err, { failedAfter: 'begin', done } ) ) ;
      }
      resolve();
    })

  } )
}

function end ( { client, done }, results ){
  client.query('end', ( err, result ) => {
    if( defined(err) ){
      throw Object.assign( err, { failedAfter: 'end', done } );
    }
    done();
    return { status: 'success', results };
  })
}

function rollback ( err ){
  client.query('rollback', ( err, result ) => {
    err.done();
    if( defined(err) ){
      //TODO debug error
    }
    return {
      status: 'error',
      description: `error happened when doing ${ err.failedAfter }`,
    };
  })

}

function recurse ( queries, index, cb ){
  
}

function doQueries ( queries, index, client, done ){

}

export default function ( queries ) {
  connect().then( ({ client, done }) => {
    begin({ client, done })
    .then(doQueries.bind(this, queries))
    .then(end)
    .catch(rollback)
  } ).catch(connectionError);
}

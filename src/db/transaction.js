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

function appendParamsToError( err,  ){ //TODO
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
        reject( err ); //TODO
      }
      resolve({
        client,
        done,
      });
    } );
  });
}

function begin ( client ){
  return new Promise( ( res, rej ) => {
    client.query('begin', ( err, result ) => {
      if( defined(err) ){
        rej( Object.assign( err, { failedAfter: 'begin' } ) ) ; //TODO
      }
      resolve();
    })

  } )
}

let commit = curry( ( client, results ) => {
  return new Promise( ( res, rej ) => {
    client.query('commit', ( err, result ) => {
      if( defined(err) ){
        reject( Object.assign( err, { failedAfter: 'end' } ) ); //TODO
      }
      resolve( results );
    })
  } )
} ) 

function rollback ( client ) {
  return new Promise( ( res, rej ) => {
    client.query('rollback', ( err, result ) => {
      if( defined(err) ){
        reject( err );
      }
      resolve();
    })
  } )
} 

function recurse ( queries, index, cb ){
  
}

function doQueries ( queries, index, client, done ){

}

export default function ( queries ) {
  connect().then( ({ client, done }) => {
    begin( client ).then(
      doQueries( client, queries )
    ).then(
      commit(client)
    ).then( results => {
      done();
      return {
        status: 'success',
        results,
      };
    } ) //TODO add the done
    .catch( err => {
      return rollback( client ).then( () => {
        done();
        return {
          status: 'error',
          description: `Transaction failed after ${ err.failedAfter }`,
        }
      } ).catch( err => {
        return {
          status: 'error',
          description: 'Transaction failed after rollback',
        }
      } )
    } )
  } ).catch(connectionError);
}

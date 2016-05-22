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
        rej( err ); //TODO
      }
      res({
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
        rej( Object.assign( err, { failedAfter: 'begin' } ) ) ;
      }
      res();
    })

  } )
}

let commit = curry( ( client, results ) => {
  return new Promise( ( res, rej ) => {
    client.query('commit', ( err, result ) => {
      if( defined(err) ){
        rej( Object.assign( err, { failedAfter: 'commit' } ) );
      }
      res( results );
    })
  } )
} ) 

function rollback ( client ) {
  return new Promise( ( res, rej ) => {
    client.query('rollback', ( err, result ) => {
      if( defined(err) ){
        rej( err );
      }
      res();
    })
  } )
} 

function recurse ( queries, index, cb ){
  
}

let doQueries = curry (( client, queries, index ) => {
  return queries.map( query => (
    ( resArr ) => (
      new Promise( ( res, rej ) => {
        client.query( query.qry, query.params, ( err, res ) => {
          if( defined(err) ){
            rej( Object.assign( err, { failedAfter: query.qry } ) );
          }
          res( resArr.concat( res ) );
        } );
      } )
    )
  ) ).reduce( ( prev, curr ) => (
    prev.then(curr)
  ), Promise.resolve() );
})

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
    } )
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

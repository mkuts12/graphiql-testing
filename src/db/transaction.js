import pg from 'pg';
import { dev as params } from '../../database.json';
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

function connString() {
  return `pg://michael:1234@172.17.0.1:5432/gamification`
}

function connect () {
  console.log('connecting');
  return new Promise(( res, rej ) => {
    pg.connect( connString(), ( err, client, done ) => {
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
  console.log('beginning');
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
  console.log('commiting');
  return new Promise( ( res, rej ) => {
    client.query('commit', ( err, result ) => {
      if( defined(err) ){
        rej( Object.assign( err, { failedAfter: 'commit' } ) );
      }
      res( results.concat( result.rows ) );
    })
  } );
} ) 

function rollback ( client ) {
  console.log('rolling');
  return new Promise( ( res, rej ) => {
    client.query('rollback', ( err, result ) => {
      if( defined(err) ){
        rej( err );
      }
      res();
    })
  } )
} 

let doQueries =( client, queries ) => ( () => {
  console.log('doing');
  let a = queries.map( query => (
    ( resArr ) => (
      new Promise( ( resolve, reject ) => {
        console.log('quriying');
        client.query( query.qry, query.params, ( err, res ) => {
          if( defined(err) ){
            reject( Object.assign( err, { failedAfter: query.qry } ) );
          }
          resolve( resArr.concat( JSON.stringify( res.rows ) ) );
        } );
      } )
    )
  ) ).reduce( ( prev, curr ) => (
  prev.then(curr)
  ), Promise.resolve([]) );
  return a;
});

export default function ( queries ) {
  let temp = connect().then( ({ client, done }) => {
    return begin( client ).then(
      doQueries( client, queries )
    ).then(
      commit( client )
    ).then( results => {
      done();
      console.log('donned');
      return {
        status: 'success',
        results: results,
      };
    } ).catch( err => {
      return rollback( client ).then( () => {
        done();
        console.log('failing');
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
  } ).catch( err => console.log(`Error in last catch is ${err}`));
  return temp;
}

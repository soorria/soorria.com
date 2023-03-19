import { useState, useEffect } from 'react'

const getPost = async id => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  const post = await response.json()
  return post
}

const myPromiseAll_WaitingForAll = promises => {
  return new Promise((resolve, reject) => {
    const results = []

    for (const promise of promises) {
      promise.then(promiseResult => {
        results.push(promiseResult)

        if (results.length === promises.length) {
          resolve(results)
        }
      })
    }
  })
}

const myPromiseAll_InOrder = promises => {
  return new Promise((resolve, reject) => {
    const results = Array(promises.length)
    let numResolvedPromises = 0
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i]
      promise.then(promiseResult => {
        results[i] = promiseResult
        numResolvedPromises++
        if (numResolvedPromises === promises.length) {
          resolve(results)
        }
      })
    }
  })
}

// List of numbers from 1 to 4
const postIdsToFetch = Array.from({ length: 4 }, (_, i) => i + 1)

const getPostPromises = () => postIdsToFetch.map(id => getPost(id))

const createExample = ({ myPromiseAll, text = {}, height }) => {
  const styles = {
    grid: {
      height: height || '400px',
      overflowY: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    },
    heading: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginTop: 0,
    },
  }

  return () => {
    const [myPromiseAllResults, setMyPromiseAllResults] = useState([])
    const [promiseAllResults, setPromiseAllResults] = useState([])

    useEffect(() => {
      myPromiseAll(getPostPromises()).then(setMyPromiseAllResults)
      Promise.all(getPostPromises()).then(setPromiseAllResults)
    }, [])

    return (
      <div style={styles.grid}>
        <div>
          <h2 style={styles.heading}>myPromiseAll</h2>
          {text.myPromiseAll ? <p>{text.myPromiseAll}</p> : null}
          {myPromiseAllResults.length ? (
            <ul>
              {myPromiseAllResults.map(post => (
                <li key={post.id}>
                  <b>Post #{post.id}</b> {post.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div>
          <h2 style={styles.heading}>Promise.all</h2>
          {text.promiseAll ? <p>{text.promiseAll}</p> : null}
          {promiseAllResults.length ? (
            <ul>
              {promiseAllResults.map(post => (
                <li key={post.id}>
                  <b>Post #{post.id}</b> {post.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    )
  }
}

export const WaitingForAllPromisesExample = createExample({
  myPromiseAll: myPromiseAll_WaitingForAll,
  text: {
    myPromiseAll: (
      <>
        Notice how the results here are often in a different order when you
        reload this demo.
      </>
    ),
    promiseAll: (
      <>
        Notice how the results here are always in the same order when you reload
        this demo.
      </>
    ),
  },
})

export const WaitingInOrderExample = createExample({
  myPromiseAll: myPromiseAll_InOrder,
  height: '304px',
})

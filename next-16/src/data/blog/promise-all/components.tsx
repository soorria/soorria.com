'use client'

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react'

type Post = { id: number; title: string }

const getPost = async (id: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  const post = await response.json()
  return post as Post
}

type MyPromiseAll = <T>(promises: Promise<T>[]) => Promise<T[]>

const myPromiseAll_Naive: MyPromiseAll = promises => {
  return new Promise((resolve, _reject) => {
    const results: unknown[] = []

    for (const promise of promises) {
      promise.then(promiseResult => {
        results.push(promiseResult)
      })
    }

    // This isn't exactly what I've written in the post, but shallow-cloning
    // the array is required due to React rerendering a bunch of extra times
    resolve([...results] as any[])
  })
}

const myPromiseAll_WaitingForAll: MyPromiseAll = promises => {
  return new Promise((resolve, _reject) => {
    const results: unknown[] = []

    for (const promise of promises) {
      promise.then(promiseResult => {
        results.push(promiseResult)

        if (results.length === promises.length) {
          resolve(results as any[])
        }
      })
    }
  })
}

const myPromiseAll_InOrder: MyPromiseAll = promises => {
  return new Promise((resolve, _reject) => {
    const results = Array(promises.length)
    let numResolvedPromises = 0
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i]!
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

const createExample = ({
  myPromiseAll,
  text = {},
  height,
}: {
  myPromiseAll: MyPromiseAll
  text?: Partial<{ myPromiseAll: ReactNode; promiseAll: ReactNode }>
  height?: string
}) => {
  const hasText = !!(text.myPromiseAll || text.promiseAll)
  const styles = {
    grid: {
      height: height || (hasText ? '361px' : '284px'),
      overflowY: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      fontSize: '0.875em',
    },
    heading: {
      fontWeight: 'bold',
      marginTop: 0,
    },
  } satisfies Record<string, CSSProperties>

  return function MyPromiseAllExample() {
    const [myPromiseAllResult, setMyPromiseAllResult] = useState({
      posts: [] as Post[],
      loading: true,
    })
    const [promiseAllResult, setPromiseAllResult] = useState({
      posts: [] as Post[],
      loading: true,
    })

    useEffect(() => {
      let usable = true

      myPromiseAll(getPostPromises()).then(posts => {
        if (!usable) return
        setMyPromiseAllResult({
          posts,
          loading: false,
        })
      })
      Promise.all(getPostPromises()).then(posts => {
        if (!usable) return
        setPromiseAllResult({
          posts,
          loading: false,
        })
      })

      return () => {
        usable = false
      }
    }, [])

    const renderResult = ({
      posts,
      loading,
    }: {
      posts: Post[]
      loading: boolean
    }) => {
      if (loading) return <p>Loading...</p>
      if (!posts.length) return <p>No results</p>
      return (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <b>Post #{post.id}</b> {post.title}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div style={styles.grid}>
        <div>
          <h2 style={styles.heading}>myPromiseAll</h2>
          {text.myPromiseAll ? <p>{text.myPromiseAll}</p> : null}
          {renderResult(myPromiseAllResult)}
        </div>
        <div>
          <h2 style={styles.heading}>Promise.all</h2>
          {text.promiseAll ? <p>{text.promiseAll}</p> : null}
          {renderResult(promiseAllResult)}
        </div>
      </div>
    )
  }
}

export const NaiveExample = createExample({
  myPromiseAll: myPromiseAll_Naive,
  text: {
    myPromiseAll: (
      <>
        Notice how the loading state barely shows (if at all!), and you see no
        results.
      </>
    ),
    promiseAll: (
      <>
        Notice how use see the loading state flicker for a moment and then see
        the results.
      </>
    ),
  },
})

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

export const InOrderExample = createExample({
  myPromiseAll: myPromiseAll_InOrder,
})

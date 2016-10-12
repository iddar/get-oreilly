const co = require('co')
const _ = require('lodash')
const wget = require('node-wget')
const readability = require('node-readability')
const cheerio = require('cheerio')

const categories = [
  'business',
  'data',
  'design',
  'iot',
  'programming',
  'security',
  'web-platform',
  'webops-perf'
]

function read (url) {
  return new Promise((resolve, reject) => {
    readability(url, (error, article, meta) => {
      if (error) return reject(error)
      resolve({article, meta})
    })
  })
}

function makeUrl (name, file) {
  return `http://www.oreilly.com/data/free/files/${name}.${file}`
}

function getFile (name, file) {
  return new Promise((resolve, reject) => {
    wget({
      url: makeUrl(name, file),
      dest: `${file}/`
    }, (error, response, body) => {
      if (error) return reject(error)
      resolve({response, body})
    })
  })
}

const baseURL = fill => `http://www.oreilly.com/${fill}/free/`

function * parse (route) {
  const {article} = yield read(baseURL(route))
  console.log(article.title)
  const $ = cheerio.load(article.html)

  const listBook = $('.callout-row a')

  const linkArrary = _.reduce(listBook, (list, item) => {
    let {href} = item.attribs

    if (href.includes('/free/')) {
      let name = href.split('/free/')[1].replace('.csp', '')
      list.push(name)
      return list
    }

    return list
  }, [])

  article.close()

  for (var i = 0; i < linkArrary.length; i++) {
    yield getFile(linkArrary[i], 'pdf')
    yield getFile(linkArrary[i], 'epub')
    console.warn(`${linkArrary[i]} download complete.`)
  }
}

co(function * () {
  for (var i = 0; i < categories.length; i++) {
    yield parse(categories[i])
  }
}).catch(e => console.log(e))

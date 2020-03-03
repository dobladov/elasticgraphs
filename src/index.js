
const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const exampleData = {
  responses: [
    {
      took: 4,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: 2976,
        max_score: 0,
        hits: [],
      },
      aggregations: {
        results: {
          doc_count_error_upper_bound: 46,
          sum_other_doc_count: 1944,
          buckets: [
            {
              key: 'https://w3id.org/class/esc/n05',
              doc_count: 192,
            },
            {
              key: 'https://w3id.org/class/esc/n02',
              doc_count: 184,
            },
            {
              key: 'https://w3id.org/class/esc/n01',
              doc_count: 153,
            },
            {
              key: 'https://w3id.org/class/esc/n06',
              doc_count: 123,
            },
            {
              key: 'https://w3id.org/class/esc/n054',
              doc_count: 114,
            },
            {
              key: 'https://w3id.org/class/esc/n03',
              doc_count: 112,
            },
            {
              key: 'https://w3id.org/class/esc/n023',
              doc_count: 111,
            },
            {
              key: 'https://w3id.org/class/esc/n022',
              doc_count: 103,
            },
            {
              key: 'https://w3id.org/class/esc/n053',
              doc_count: 96,
            },
            {
              key: 'https://w3id.org/class/esc/n0541',
              doc_count: 92,
            },
          ],
        },
      },
      status: 200,
    },
  ],
}

require('dotenv').config()

const DonutGraph = require('./components/DonutGraph.jsx')

const { SERVER_HOST, SERVER_PORT } = process.env

const server = express()

server.get('/stats', async (req, res) => {
  const body = ReactDOMServer.renderToString(
    React.createElement(DonutGraph, { rawData: exampleData }, null),
  )
  res.setHeader('content-type', 'image/svg+xml')
  res.send(body)
})


server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.info(`oerworldmap-ui server listening on http://${SERVER_HOST}:${SERVER_PORT}`)
})

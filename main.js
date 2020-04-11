const axios = require('axios')
const locations = require('./data.json')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const searchResultsId = 'Page 1 of '

const fetchJobData = async (url) => {
    const { data } = await axios.get(url)
    const pos = data.indexOf(searchResultsId)
    return data.slice(pos + 7, pos + 17).replace(/\D+/g, "")
}

const FormatJobData = async (local) => {
    const jobUrl = `https://www.indeed.com/jobs?q=javascript&l=${local}`
    return {
        city: local.split('%2C+')[0],
        qty: await fetchJobData(jobUrl),
    }
}

const compileJobsData = () => (Promise.all(locations.map(FormatJobData)))

const generateCsvJobsData = async () => {
    const csvName = `jobs-data-${new Date().getTime()}.csv`
    const jobsData = await compileJobsData()
    const csvWriter = createCsvWriter({
        path: csvName,
        header: [
            { id: 'city', title: 'City' },
            { id: 'qty', title: 'Qty' },
        ]
    });
    csvWriter
        .writeRecords(jobsData)
        .then(() => console.log(`${csvName} created successfully`))
        .catch(() => { })
}

generateCsvJobsData()
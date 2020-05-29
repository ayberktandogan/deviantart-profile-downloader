const config = require('./config/config')
const axios = require('axios')
const fs = require('fs')
const Path = require('path')

const { username, client_id, client_secret, limit } = config
let access_token

console.log(`Downloading all images from account: ${username}`)
console.log(`Your client id: ${client_id}`)
console.log(`Your client secret: ${client_secret}`)

async function getBearerToken() {
    return axios.get(`https://www.deviantart.com/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`)
}

async function getImagesFromAccount(token, offset) {
    const headers = {
        "Authorization": "Bearer " + token
    }
    const link = `https://www.deviantart.com/api/v1/oauth2/gallery/all?username=${username}&limit=${limit}&mature_content=true&offset=${offset}`
    console.log(`Sending GET request to: ${link}`)

    return await axios.get(link, { headers: headers })
}

async function recursiveGetImagesFromAccount(access_token) {
    let has_more = true
    let offset = 0
    let results = []

    while (has_more) {
        const res = await getImagesFromAccount(access_token, offset)
        results.push(...res.data.results)
        has_more = res.data.has_more
        offset += limit
    }
    console.log(`\n\n\nFound ${results.length} image(s)\n\n\n`)
    return results
}

async function getImageFromLink(link) {
    let res
    try {
        res = await axios.get(link, { responseType: "stream" })
    } catch (err) {
        throw err
    }
    return res.data
}

async function saveImageToDisk(image, imageName) {
    const path = Path.resolve(__dirname, `./images`, `${imageName}.png`)
    const writer = fs.createWriteStream(path, { flags: 'w' })

    if (!writer) {
        console.log(err)
    }

    try {
        image.pipe(writer)
    } catch (err) {
        console.log(err)
    }

    return new Promise((resolve, reject) => {

        writer.on('finish', async () => {
            console.log(`${imageName} saved.`)
            writer.end()
        })


        writer.on('error', err => {
            console.log(`We couldn't save ${imageName} for some reason.`)
            console.log(err)
            fs.unlink(path, (err) => {
                if (err) {
                    return console.log(err)
                }
                console.log(`${path} deleted.`)
                return true
            })
        })
    })
}


async function main() {
    res = await getBearerToken()
    access_token = res.data.access_token
    console.log(`Your token is ${access_token}, this token will be available for 60 minutes.\n\n\n`)

    const results = await recursiveGetImagesFromAccount(access_token)

    const path = Path.resolve(__dirname, `./images`)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }

    for (const result of results) {
        let image

        try {
            image = await getImageFromLink(result.content.src)
        } catch (err) {
            console.log(err)
        }

        saveImageToDisk(image, result.title)
    }

    console.log(`\n\n\nDownload is finished.`)
}

main()
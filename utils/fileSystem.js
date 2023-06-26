const fse = require('fs-extra')
const fs = require('fs')

async function createDirectory (directory) {
    try {
      await fse.ensureDir(`./${directory}`)
      console.log('Successfully added folders!')
    } catch (err) {
      console.error(err)
    }
  }


// We can use this function to overwrite the files so there is no need to create new function for that
async function createFile (data, name, dir) {

    const base64 = data.split(';base64,').pop() // we need pure base64 and so we delete the heading

    fs.writeFile(`./${dir}/${name}.jpg`, base64, {encoding: 'base64'}, function(err) {
        console.log(`File: ${name}.jpg created`)
    });
}   

// Delete Directory

// Update Directory

module.exports = {
    createDirectory,
    createFile 
}
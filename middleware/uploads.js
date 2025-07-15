'use strict'

const {Multer} = require('../services/multer')

// This file is used to handle file uploads in the application.
// It defines the allowed MIME types for different file categories and the destination paths for storing uploaded files
const mimeTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/png', 'image/svg', 'image/svg+xml'],
    document: [
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    'image-document': [
        'image/jpg', 'image/jpeg', 'image/png', 'image/svg', 'image/svg+xml',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
}

const storeDestination = {
    'problemFocusedImage': "problem-focused-strategies/",
    'healthyLifestyleImage': "healthy-lifestyle/",
    'educationResourcesImage': "education-resources/",
    'categoryImage': "category/",
    
}

module.exports =  (fileType, fileSize, filePath) => {
        const uploader = new Multer(mimeTypes[fileType], fileSize, storeDestination[filePath]);
        return uploader.upload
}

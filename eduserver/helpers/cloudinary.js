// Import the Cloudinary v2 library to interact with Cloudinary's media storage
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables (from .env file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,    // Cloudinary cloud name (set in .env)
    api_key: process.env.CLOUDINARY_API_KEY,          // Cloudinary API key (set in .env)
    api_secret: process.env.CLOUDINARY_API_SECRET,    // Cloudinary API secret (set in .env)
});

// Function to upload media (e.g., images, videos) to Cloudinary
const uploadMediaToCloudinary = async (filePath) => {
    try {
        // Upload the media file to Cloudinary and return the result
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",  // Automatically determine the file type (image, video, etc.)
        });

        // Return the upload result (contains information like URL, public ID, etc.)
        return result;
    } catch (error) {
        console.log(error);  // Log the error if the upload fails
        throw new Error("Error uploading to cloudinary");  // Throw a custom error message
    }
};

// Function to delete media from Cloudinary using its public ID
const deleteMediaFromCloudinary = async (publicId) => {
    try {
        // Delete the media from Cloudinary by its public ID
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);  // Log the error if the deletion fails
        throw new Error("failed to delete asset from cloudinary");  // Throw a custom error message
    }
};

// Export the functions to be used elsewhere in the application
module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };

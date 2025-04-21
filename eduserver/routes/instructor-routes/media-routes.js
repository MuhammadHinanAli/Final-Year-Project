// Import necessary modules
const express = require("express");
const multer = require("multer");

// Import helper functions to handle Cloudinary operations
const {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

// Create a new Express router instance
const router = express.Router();

// Configure Multer middleware to store uploaded files temporarily in "uploads/" folder
const upload = multer({ dest: "uploads/" });

// Route to upload a single media file to Cloudinary
// Endpoint: POST /media/upload
// Uses Multer middleware to handle a single file upload with the field name "file"
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // Upload the file to Cloudinary using the helper function
        const result = await uploadMediaToCloudinary(req.file.path);

        // Respond with success and Cloudinary upload result
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        console.log(e);

        // Respond with error message in case of failure
        res.status(500).json({ success: false, message: "Error uploading file" });
    }
});

// Route to delete a media file from Cloudinary by its public ID
// Endpoint: DELETE /media/delete/:id
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Asset ID is required",
            });
        }

        // Delete the media using helper function
        await deleteMediaFromCloudinary(id);

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Asset deleted successfully from Cloudinary",
        });
    } catch (e) {
        console.log(e);

        // Respond with error message in case of failure
        res.status(500).json({ success: false, message: "Error deleting file" });
    }
});

// Route to handle bulk upload of multiple media files to Cloudinary
// Endpoint: POST /media/bulk-upload
// Accepts up to 10 files with the field name "files"
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
    try {
        // Map over all uploaded files and initiate Cloudinary uploads
        const uploadPromises = req.files.map((fileItem) =>
            uploadMediaToCloudinary(fileItem.path)
        );

        // Wait for all upload promises to resolve
        const results = await Promise.all(uploadPromises);

        // Respond with array of uploaded file details
        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (event) {
        console.log(event);

        // Respond with error message in case of failure
        res
            .status(500)
            .json({ success: false, message: "Error in bulk uploading files" });
    }
});

// Export the router so it can be used in the main server file
module.exports = router;

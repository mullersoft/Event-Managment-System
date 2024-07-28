const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/APIFeatures");

/**
 * Factory function to delete a document by ID.
 * @param {Object} Model - Mongoose model.
 * @returns {Function} Express middleware function.
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

/**
 * Factory function to update a document by ID.
 * @param {Object} Model - Mongoose model.
 * @returns {Function} Express middleware function.
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Error handling for document not found
    if (!doc) {
      return next(new AppError("No document found with that ID!", 404));
    }
    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

/**
 * Factory function to create a new document.
 * @param {Object} Model - Mongoose model.
 * @returns {Function} Express middleware function.
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: { doc },
    });
  });

/**
 * Factory function to get a single document by ID.
 * @param {Object} Model - Mongoose model.
 * @param {Object} [popOptions] - Optional populate options for the query.
 * @returns {Function} Express middleware function.
 */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // Error handling for document not found
    if (!doc) {
      return next(new AppError("No document found with that ID!", 404));
    }
    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

/**
 * Factory function to get all documents with optional filtering, sorting, limiting fields, and pagination.
 * @param {Object} Model - Mongoose model.
 * @returns {Function} Express middleware function.
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Allow nested GET queries, e.g., retrieving reviews for a specific event
    let filter = {};
    if (req.params.eventId) filter = { event: req.params.eventId };

    // Initialize query features
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // Send the response
    res.status(200).json({
      status: "success",
      result: doc.length,
      data: { data: doc },
    });
  });

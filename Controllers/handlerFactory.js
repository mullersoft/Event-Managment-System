const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/APIFeatures");

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
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Error handling for not found
    if (!doc) {
      return next(new AppError("No document is found with that ID!", 404));
    }
    res.status(200).json({ status: "success", data: { data: doc } });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate("reviews");
    // Error handling for not found
    if (!doc) {
      return next(new AppError("No document is found with that ID!", 404));
    }
    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow nested GET reviews on event(hack)
    let filter = {};
    if (req.params.eventId) filter = { event: req.params.eventId };
    // Execute the query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();

    // Send the response
    res.status(200).json({
      status: "success",
      result: doc.length,
      data: { data: doc },
    });
  });

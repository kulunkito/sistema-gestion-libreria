import * as reportService from "../services/report.service.js";

export async function summary(req, res, next) {
  try {
    res.json({ success: true, data: await reportService.getSalesSummary(req.validatedQuery) });
  } catch (error) {
    next(error);
  }
}

export async function topProducts(req, res, next) {
  try {
    res.json({ success: true, data: await reportService.getTopProducts(req.validatedQuery) });
  } catch (error) {
    next(error);
  }
}

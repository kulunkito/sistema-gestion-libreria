import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";

function dateFilter(from, to) {
  const clauses = ["s.status = 'COMPLETED'"];
  const replacements = {};
  if (from) {
    clauses.push("s.created_at >= :fromDate");
    replacements.fromDate = `${from} 00:00:00`;
  }
  if (to) {
    clauses.push("s.created_at < DATE_ADD(:toDate, INTERVAL 1 DAY)");
    replacements.toDate = `${to} 00:00:00`;
  }
  return { where: clauses.join(" AND "), replacements };
}

export async function getSalesSummary({ from, to }) {
  const filter = dateFilter(from, to);
  const [summary] = await sequelize.query(
    `SELECT COUNT(*) AS saleCount, COALESCE(SUM(s.total), 0) AS totalSales
     FROM sales s WHERE ${filter.where}`,
    { replacements: filter.replacements, type: QueryTypes.SELECT }
  );
  return {
    saleCount: Number(summary.saleCount),
    totalSales: Number(summary.totalSales),
    averageSale: Number(summary.saleCount)
      ? Number((Number(summary.totalSales) / Number(summary.saleCount)).toFixed(2))
      : 0
  };
}

export async function getTopProducts({ from, to, limit = 10 }) {
  const filter = dateFilter(from, to);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  return sequelize.query(
    `SELECT p.id, p.sku, p.name,
            SUM(sd.quantity) AS quantitySold,
            SUM(sd.subtotal) AS revenue
     FROM sale_details sd
     INNER JOIN sales s ON s.id = sd.sale_id
     INNER JOIN products p ON p.id = sd.product_id
     WHERE ${filter.where}
     GROUP BY p.id, p.sku, p.name
     ORDER BY quantitySold DESC, revenue DESC
     LIMIT ${safeLimit}`,
    { replacements: filter.replacements, type: QueryTypes.SELECT }
  );
}

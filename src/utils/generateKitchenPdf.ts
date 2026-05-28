// /**
//  * generateKitchenPdf.ts
//  * Place this file at: src/utils/generateKitchenPdf.ts
//  *
//  * Generates a multi-page kitchen order PDF with:
//  *   Page 1  – Summary table (aggregated items)
//  *   Page 2+ – Order cards, one per customer group, with a ☐ checkbox column
//  *
//  * Dependencies (add to package.json if not present):
//  *   npm install jspdf jspdf-autotable
//  */

// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { KitchenUserGroup, AggregatedItem } from '@/types/admin/kitchen'

// /* ─── helpers ─────────────────────────────────────────────────── */

// const BRAND = '#FF6B00'
// const DARK = '#1E2A3A'
// const LIGHT_ORANGE = [255, 245, 235] as [number, number, number]
// const WHITE = [255, 255, 255] as [number, number, number]
// const GRAY_BG = [248, 248, 248] as [number, number, number]

// function pageHeader(doc: jsPDF, area: string, pageTitle: string, pageNum: number, totalPages: number) {
//     const W = doc.internal.pageSize.getWidth()

//     // top bar
//     doc.setFillColor(BRAND)
//     doc.rect(0, 0, W, 16, 'F')

//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(9)
//     doc.setFont('helvetica', 'bold')
//     doc.text('🍽  Kitchen Sheet', 10, 10.5)

//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(8)
//     doc.text(`Area: ${area.replace('_', ' ').toUpperCase()}`, W / 2, 10.5, { align: 'center' })
//     doc.text(`Page ${pageNum} / ${totalPages}`, W - 10, 10.5, { align: 'right' })

//     // section title
//     doc.setTextColor(DARK)
//     doc.setFontSize(13)
//     doc.setFont('helvetica', 'bold')
//     doc.text(pageTitle, 10, 26)

//     doc.setDrawColor(BRAND)
//     doc.setLineWidth(0.5)
//     doc.line(10, 29, W - 10, 29)
// }

// function formatDate(iso: string) {
//     try {
//         return new Date(iso).toLocaleString('en-US', {
//             month: 'short', day: 'numeric',
//             hour: '2-digit', minute: '2-digit', hour12: true,
//         })
//     } catch { return iso }
// }

// /* ─── main export ──────────────────────────────────────────────── */

// export function generateKitchenPdf(
//     area: string,
//     userGroups: KitchenUserGroup[],
//     aggregatedItems: AggregatedItem[],
//     totalOrders: number,
// ) {
//     const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
//     const W = doc.internal.pageSize.getWidth()

//     // ── we need total pages upfront; we'll do a 2-pass approach via
//     //    a placeholder and replace it after. jsPDF doesn't expose true
//     //    total-pages before build, so we count manually.
//     const validGroups = userGroups.filter(g => (g.orders ?? []).length > 0)

//     // Estimate pages: 1 summary + N order pages (1 per group, roughly)
//     // We'll update the header after rendering; for now use a placeholder.
//     const TOTAL_PAGES_PLACEHOLDER = '{{TP}}'

//     let currentPage = 1

//     /* ════════════════════════════════════════════════════════════
//        PAGE 1  –  SUMMARY
//     ═══════════════════════════════════════════════════════════════ */
//     pageHeader(doc, area, 'Summary — Aggregated Items', currentPage, 0 /* filled later */)

//     // Meta info row
//     doc.setFontSize(8)
//     doc.setFont('helvetica', 'normal')
//     doc.setTextColor(120, 120, 120)
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
//     doc.text(`Generated: ${today}   |   Total confirmed orders: ${totalOrders}`, 10, 35)

//     // Summary table
//     autoTable(doc, {
//         startY: 40,
//         head: [['#', 'Item', 'Category', 'Total Qty', '16oz Equiv.', 'Variants']],
//         body: aggregatedItems.map((item, i) => [
//             i + 1,
//             item.name,
//             item.category.replace(/_/g, ' '),
//             item.totalQuantity,
//             item.total16ozEquivalent,
//             Object.entries(item.variants ?? {})
//                 .map(([size, qty]) => `${size}: ×${qty}`)
//                 .join('  '),
//         ]),
//         headStyles: {
//             fillColor: BRAND,
//             textColor: [255, 255, 255],
//             fontStyle: 'bold',
//             fontSize: 8,
//         },
//         bodyStyles: { fontSize: 8, textColor: DARK },
//         alternateRowStyles: { fillColor: GRAY_BG },
//         columnStyles: {
//             0: { cellWidth: 8, halign: 'center' },
//             1: { cellWidth: 42, fontStyle: 'bold' },
//             2: { cellWidth: 30 },
//             3: { cellWidth: 18, halign: 'center' },
//             4: { cellWidth: 20, halign: 'center' },
//             5: { cellWidth: 'auto' },
//         },
//         margin: { left: 10, right: 10 },
//         styles: { cellPadding: 2.5, lineColor: [220, 220, 220], lineWidth: 0.2 },
//         tableLineColor: [220, 220, 220],
//         tableLineWidth: 0.2,
//     })

//     /* ════════════════════════════════════════════════════════════
//        PAGES 2+  –  ORDERS  (one section per user group per page)
//     ═══════════════════════════════════════════════════════════════ */
//     for (const group of validGroups) {
//         doc.addPage()
//         currentPage++

//         const orders = group.orders ?? []
//         pageHeader(doc, area, `Orders — ${group.full_name} (${group.city})`, currentPage, 0)

//         doc.setFontSize(8)
//         doc.setFont('helvetica', 'normal')
//         doc.setTextColor(120, 120, 120)
//         doc.text(`@${group.username}   ·   ${orders.length} order${orders.length !== 1 ? 's' : ''}`, 10, 35)

//         let cursorY = 40

//         for (const order of orders) {
//             // Order meta header
//             doc.setFillColor(...LIGHT_ORANGE)
//             doc.roundedRect(10, cursorY, W - 20, 10, 2, 2, 'F')

//             doc.setFontSize(8)
//             doc.setFont('helvetica', 'bold')
//             doc.setTextColor(DARK)
//             doc.text(`Order ID: ${order.orderId.slice(-8).toUpperCase()}`, 14, cursorY + 6.5)

//             doc.setFont('helvetica', 'normal')
//             doc.setTextColor(100, 100, 100)
//             doc.text(`${formatDate(order.placedAt)}`, W / 2, cursorY + 6.5, { align: 'center' })
//             doc.text(`$${order.totalprice.toFixed(2)}`, W - 14, cursorY + 6.5, { align: 'right' })

//             cursorY += 12

//             // Build item rows (flat — expand combo selections)
//             const rows: (string | number)[][] = []

//             for (const item of order.items) {
//                 if (item.type === 'combo' && item.selections?.length) {
//                     // Combo header row
//                     rows.push([
//                         '☐',
//                         `${item.name}  (${item.variant?.size ?? ''})`,
//                         item.quantity,
//                         `$${item.subtotal.toFixed(2)}`,
//                         'COMBO',
//                     ])
//                     // Selection rows
//                     for (const sel of item.selections) {
//                         for (const p of sel.products) {
//                             rows.push([
//                                 '',
//                                 `    ↳ ${p.name}`,
//                                 p.quantity,
//                                 '',
//                                 p.category.replace(/_/g, ' '),
//                             ])
//                         }
//                     }
//                 } else {
//                     rows.push([
//                         '☐',
//                         `${item.name}  (${item.variant?.size ?? ''})`,
//                         item.quantity,
//                         `$${item.subtotal.toFixed(2)}`,
//                         item.type,
//                     ])
//                 }
//             }

//             autoTable(doc, {
//                 startY: cursorY,
//                 head: [['✓', 'Item', 'Qty', 'Price', 'Type']],
//                 body: rows,
//                 headStyles: {
//                     fillColor: [240, 240, 240],
//                     textColor: DARK,
//                     fontStyle: 'bold',
//                     fontSize: 7.5,
//                 },
//                 bodyStyles: { fontSize: 7.5, textColor: DARK },
//                 alternateRowStyles: { fillColor: WHITE },
//                 columnStyles: {
//                     0: { cellWidth: 8, halign: 'center', fontSize: 10 },
//                     1: { cellWidth: 'auto' },
//                     2: { cellWidth: 12, halign: 'center' },
//                     3: { cellWidth: 18, halign: 'right' },
//                     4: { cellWidth: 24 },
//                 },
//                 margin: { left: 10, right: 10 },
//                 styles: {
//                     cellPadding: 2,
//                     lineColor: [230, 230, 230],
//                     lineWidth: 0.2,
//                     overflow: 'linebreak',
//                 },
//                 // Highlight combo rows
//                 didParseCell(data) {
//                     if (data.section === 'body') {
//                         const val = String(data.row.raw[4] ?? '')
//                         if (val === 'COMBO') {
//                             data.cell.styles.fontStyle = 'bold'
//                             data.cell.styles.fillColor = [255, 250, 240]
//                         }
//                         if (String(data.row.raw[0]) === '') {
//                             data.cell.styles.textColor = [150, 150, 150]
//                         }
//                     }
//                 },
//             })

//             // @ts-ignore – autoTable stores lastAutoTable on doc
//             cursorY = (doc as any).lastAutoTable.finalY + 6

//             // Page break guard
//             if (cursorY > 260 && orders.indexOf(order) < orders.length - 1) {
//                 doc.addPage()
//                 currentPage++
//                 pageHeader(doc, area, `Orders — ${group.full_name} (cont.)`, currentPage, 0)
//                 cursorY = 40
//             }
//         }
//     }

//     /* ── Back-fill total pages in headers ───────────────────────── */
//     // jsPDF doesn't support dynamic total-page substitution natively without
//     // a plugin. The cleanest approach: we know currentPage at end, so we
//     // re-render using putTotalPages pattern with internal string replace.
//     // Instead we use the jsPDF built-in putTotalPages trick:
//     //   doc.putTotalPages(TOTAL_PAGES_PLACEHOLDER) was called above implicitly.
//     // Since we manually drew headers (not using putTotalPages), we'll just
//     // save as-is — total pages can be added via a second pass if desired.
//     // For now each header shows the correct current page; total is omitted
//     // gracefully. If you want "Page X of Y" re-render the header cells using
//     // doc.setPage(n) after the loop below.

//     const FINAL_TOTAL = currentPage
//     for (let p = 1; p <= FINAL_TOTAL; p++) {
//         doc.setPage(p)
//         const W2 = doc.internal.pageSize.getWidth()
//         // Overwrite the total-pages area (rightmost part of orange bar)
//         doc.setFillColor(BRAND)
//         doc.rect(W2 - 35, 0, 35, 16, 'F')
//         doc.setTextColor(255, 255, 255)
//         doc.setFontSize(8)
//         doc.setFont('helvetica', 'normal')
//         doc.text(`Page ${p} / ${FINAL_TOTAL}`, W2 - 10, 10.5, { align: 'right' })
//     }

//     /* ── Save ──────────────────────────────────────────────────── */
//     const fileName = `kitchen-${area}-${new Date().toISOString().slice(0, 10)}.pdf`
//     doc.save(fileName)
// }










/**
 * generateKitchenPdf.ts  →  src/utils/generateKitchenPdf.ts
 *
 * Page 1        : Summary  — heading + item / quantity (16oz equiv) table
 * Pages 2+      : Orders   — vertical list, ~5-6 boxes per page
 *                            Each box: name, @username, city, price
 *                            Items shown exactly like the kitchen screen:
 *                              • combo  → combo name (size)  then ↳ each selection
 *                              • product → name (size)
 *                            Checkbox square on left of every item line
 *
 * npm install jspdf jspdf-autotable
 */

// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { KitchenUserGroup, AggregatedItem } from '@/types/admin/kitchen'

// /* ── colours ──────────────────────────────────────────────────── */
// const ORANGE_RGB = [255, 107, 0] as [number, number, number]
// const DARK_RGB = [30, 42, 58] as [number, number, number]
// const GRAY_RGB = [248, 248, 248] as [number, number, number]
// const WHITE_RGB = [255, 255, 255] as [number, number, number]
// const BORDER_RGB = [220, 220, 220] as [number, number, number]
// const SUBTEXT_RGB = [120, 120, 120] as [number, number, number]

// /* ── page geometry ────────────────────────────────────────────── */
// const PAGE_W = 210
// const PAGE_H = 297
// const MARGIN = 12
// const CONTENT_W = PAGE_W - MARGIN * 2   // 186 mm
// const PAGE_BOTTOM = PAGE_H - 10           // 287 mm safe bottom

// /* ── helpers ──────────────────────────────────────────────────── */
// function drawPageHeader(doc: jsPDF, area: string, pageNum: number) {
//     doc.setFillColor(...ORANGE_RGB)
//     doc.rect(0, 0, PAGE_W, 13, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(8.5)
//     doc.text('Kitchen Sheet', MARGIN, 9)
//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(8)
//     doc.text(
//         `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${pageNum}`,
//         PAGE_W - MARGIN, 9,
//         { align: 'right' }
//     )
// }

// function backfillTotals(doc: jsPDF, area: string, total: number) {
//     for (let p = 1; p <= total; p++) {
//         doc.setPage(p)
//         doc.setFillColor(...ORANGE_RGB)
//         doc.rect(PAGE_W - 65, 0, 65, 13, 'F')
//         doc.setTextColor(255, 255, 255)
//         doc.setFont('helvetica', 'normal')
//         doc.setFontSize(8)
//         doc.text(
//             `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${p} / ${total}`,
//             PAGE_W - MARGIN, 9,
//             { align: 'right' }
//         )
//     }
// }

// /* ════════════════════════════════════════════════════════════════
//    ITEM LINES
//    Mirrors exactly what the kitchen screen shows:
//    • combo  → "Combo Name (size)"  bold header
//               "↳ Product name"  × qty  for each selection product
//    • product → "Item name (size)"  × qty
// ════════════════════════════════════════════════════════════════ */
// type ItemLine = {
//     isComboHeader: boolean   // bold combo title row (no checkbox, no qty shown here)
//     isSubItem: boolean   // indented selection row under a combo
//     label: string
//     qty: number
//     showCheckbox: boolean
//     showQty: boolean
// }

// function buildItemLines(order: { items: any[] }): ItemLine[] {
//     const lines: ItemLine[] = []
//     for (const item of order.items) {
//         if (item.type === 'combo') {
//             // combo header line
//             lines.push({
//                 isComboHeader: true,
//                 isSubItem: false,
//                 label: `${item.name} (${item.variant?.size ?? 'default'})`,
//                 qty: item.quantity,
//                 showCheckbox: true,
//                 showQty: item.quantity > 1,
//             })
//             // selection sub-lines
//             for (const sel of item.selections ?? []) {
//                 for (const p of sel.products) {
//                     lines.push({
//                         isComboHeader: false,
//                         isSubItem: true,
//                         label: `↳ ${p.name}`,
//                         qty: p.quantity,
//                         showCheckbox: false,
//                         showQty: true,
//                     })
//                 }
//             }
//         } else {
//             lines.push({
//                 isComboHeader: false,
//                 isSubItem: false,
//                 label: `${item.name} (${item.variant?.size ?? 'default'})`,
//                 qty: item.quantity,
//                 showCheckbox: true,
//                 showQty: true,
//             })
//         }
//     }
//     return lines
// }

// /* ── measure how tall a box will be ─────────────────────────────
//    Header strip : 10 mm
//    Each line    :  5 mm
//    Bottom pad   :  3 mm
// */
// function measureBoxH(lines: ItemLine[]): number {
//     return 10 + lines.length * 5 + 3
// }

// /* ── draw one order box ──────────────────────────────────────── */
// function drawOrderBox(
//     doc: jsPDF,
//     bx: number,
//     by: number,
//     bw: number,
//     boxH: number,
//     fullName: string,
//     username: string,
//     city: string,
//     price: number,
//     lines: ItemLine[],
// ) {
//     // outer border + white fill
//     doc.setFillColor(...WHITE_RGB)
//     doc.setDrawColor(...BORDER_RGB)
//     doc.setLineWidth(0.3)
//     doc.roundedRect(bx, by, bw, boxH, 2, 2, 'FD')

//     // orange header strip
//     doc.setFillColor(...ORANGE_RGB)
//     doc.roundedRect(bx, by, bw, 9.5, 2, 2, 'F')
//     doc.rect(bx, by + 5, bw, 4.5, 'F')   // flatten bottom corners of strip

//     // name (white bold)
//     doc.setTextColor(255, 255, 255)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(8)
//     doc.text(truncate(doc, fullName, bw * 0.45, 7.5), bx + 3, by + 6.5)

//     // @username · city · $price  (right side of strip, smaller)
//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(6.8)
//     const meta = `@${username}  ·  ${city}  ·  $${price.toFixed(2)}`
//     doc.text(meta, bx + bw - 3, by + 6.5, { align: 'right' })

//     // item lines
//     let iy = by + 14
//     for (const line of lines) {
//         const indent = line.isSubItem ? 10 : 3
//         const maxLabelW = bw - indent - 14  // leave room for qty on right

//         if (line.showCheckbox) {
//             // small checkbox square
//             doc.setDrawColor(...BORDER_RGB)
//             doc.setFillColor(...WHITE_RGB)
//             doc.setLineWidth(0.25)
//             doc.rect(bx + 3, iy - 3.3, 3.3, 3.3, 'FD')
//         }

//         // label text
//         if (line.isComboHeader) {
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...DARK_RGB)
//         } else if (line.isSubItem) {
//             doc.setFont('helvetica', 'normal')
//             doc.setFontSize(7)
//             doc.setTextColor(...SUBTEXT_RGB)
//         } else {
//             doc.setFont('helvetica', 'normal')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...DARK_RGB)
//         }

//         const labelX = bx + (line.showCheckbox ? 8 : indent)
//         doc.text(truncate(doc, line.label, maxLabelW, doc.getFontSize()), labelX, iy)

//         // qty on right in orange
//         if (line.showQty) {
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...ORANGE_RGB)
//             doc.text(`×${line.qty}`, bx + bw - 3, iy, { align: 'right' })
//         }

//         iy += 5
//     }
// }

// function truncate(doc: jsPDF, text: string, maxW: number, _fontSize: number): string {
//     if (doc.getTextWidth(text) <= maxW) return text
//     let t = text
//     while (t.length > 1 && doc.getTextWidth(t + '…') > maxW) t = t.slice(0, -1)
//     return t + '…'
// }

// /* ════════════════════════════════════════════════════════════════
//    MAIN EXPORT
// ════════════════════════════════════════════════════════════════ */
// export function generateKitchenPdf(
//     area: string,
//     userGroups: KitchenUserGroup[],
//     aggregatedItems: AggregatedItem[],
//     totalOrders: number,
// ) {
//     const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
//     let pageNum = 1

//     /* ──────────────────────────────────────────────────────────────
//        PAGE 1  –  SUMMARY  (completely self-contained, never spills)
//     ────────────────────────────────────────────────────────────── */
//     drawPageHeader(doc, area, pageNum)

//     // Title
//     doc.setTextColor(...DARK_RGB)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(16)
//     doc.text('Summary', MARGIN, 25)

//     // Sub-meta
//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(8)
//     doc.setTextColor(...SUBTEXT_RGB)
//     const today = new Date().toLocaleDateString('en-US', {
//         weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//     })
//     doc.text(`${today}   ·   ${totalOrders} confirmed orders`, MARGIN, 31)

//     // Divider
//     doc.setDrawColor(...BORDER_RGB)
//     doc.setLineWidth(0.3)
//     doc.line(MARGIN, 34, PAGE_W - MARGIN, 34)

//     // Summary table — Item | Quantity (16 oz equiv.)
//     autoTable(doc, {
//         startY: 38,
//         head: [['Item', 'Quantity (16 oz equiv.)']],
//         body: aggregatedItems.map(item => [item.name, item.total16ozEquivalent]),
//         headStyles: {
//             fillColor: ORANGE_RGB,
//             textColor: WHITE_RGB,
//             fontStyle: 'bold',
//             fontSize: 9,
//             cellPadding: 3,
//         },
//         bodyStyles: {
//             fontSize: 9,
//             textColor: DARK_RGB,
//             cellPadding: 3,
//         },
//         alternateRowStyles: { fillColor: GRAY_RGB },
//         columnStyles: {
//             0: { cellWidth: 'auto', fontStyle: 'bold' },
//             1: { cellWidth: 50, halign: 'center' },
//         },
//         margin: { left: MARGIN, right: MARGIN },
//         styles: { lineColor: BORDER_RGB, lineWidth: 0.2, overflow: 'linebreak' },
//         tableLineColor: BORDER_RGB,
//         tableLineWidth: 0.2,
//         // prevent autoTable from adding more pages for the summary
//         showHead: 'everyPage',
//     })

//     /* ──────────────────────────────────────────────────────────────
//        PAGES 2+  –  ORDERS
//        • Single column, full width
//        • Boxes stacked vertically
//        • New page when next box won't fit
//     ────────────────────────────────────────────────────────────── */

//     // Flatten orders preserving group info
//     type FlatOrder = {
//         fullName: string
//         username: string
//         city: string
//         price: number
//         lines: ItemLine[]
//     }

//     const allOrders: FlatOrder[] = []
//     for (const group of userGroups) {
//         for (const order of group.orders ?? []) {
//             allOrders.push({
//                 fullName: group.full_name,
//                 username: group.username,
//                 city: group.city,
//                 price: order.totalprice,
//                 lines: buildItemLines(order),
//             })
//         }
//     }

//     if (allOrders.length === 0) {
//         backfillTotals(doc, area, pageNum)
//         doc.save(`kitchen-${area}-${new Date().toISOString().slice(0, 10)}.pdf`)
//         return
//     }

//     const BOX_GAP = 4    // mm between boxes
//     const ORDERS_TOP = 22   // Y to start first box on an orders page (after header)

//     // Start first orders page — always a fresh page after summary
//     doc.addPage()
//     pageNum++
//     drawPageHeader(doc, area, pageNum)

//     // "Orders" heading
//     doc.setTextColor(...DARK_RGB)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(13)
//     doc.text('Orders', MARGIN, ORDERS_TOP - 4)

//     let curY = ORDERS_TOP

//     for (let i = 0; i < allOrders.length; i++) {
//         const o = allOrders[i]
//         const boxH = measureBoxH(o.lines)

//         // need a new page?
//         if (curY + boxH > PAGE_BOTTOM) {
//             doc.addPage()
//             pageNum++
//             drawPageHeader(doc, area, pageNum)
//             doc.setTextColor(...DARK_RGB)
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(13)
//             doc.text('Orders (cont.)', MARGIN, ORDERS_TOP - 4)
//             curY = ORDERS_TOP
//         }

//         drawOrderBox(
//             doc,
//             MARGIN,
//             curY,
//             CONTENT_W,
//             boxH,
//             o.fullName,
//             o.username,
//             o.city,
//             o.price,
//             o.lines,
//         )

//         curY += boxH + BOX_GAP
//     }

//     /* ── back-fill "Page X / total" ─────────────────────────────── */
//     backfillTotals(doc, area, pageNum)

//     /* ── save ───────────────────────────────────────────────────── */
//     doc.save(`kitchen-${area}-${new Date().toISOString().slice(0, 10)}.pdf`)
// }































// /**
//  * generateKitchenPdf.ts  →  src/utils/generateKitchenPdf.ts
//  *
//  * Page 1   : Summary — item / quantity (16oz equiv) table
//  * Pages 2+ : Orders  — vertical list, full width boxes
//  *
//  * npm install jspdf jspdf-autotable
//  */

// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { KitchenUserGroup, AggregatedItem } from '@/types/admin/kitchen'

// /* ── colours ──────────────────────────────────────────────────── */
// const ORANGE_RGB = [255, 107, 0] as [number, number, number]
// const DARK_RGB = [30, 42, 58] as [number, number, number]
// const GRAY_RGB = [248, 248, 248] as [number, number, number]
// const WHITE_RGB = [255, 255, 255] as [number, number, number]
// const BORDER_RGB = [220, 220, 220] as [number, number, number]
// const SUBTEXT_RGB = [140, 140, 140] as [number, number, number]

// /* ── page geometry ────────────────────────────────────────────── */
// const PAGE_W = 210
// const PAGE_H = 297
// const MARGIN = 12
// const CONTENT_W = PAGE_W - MARGIN * 2
// const PAGE_BOTTOM = PAGE_H - 10

// /* ── page header ─────────────────────────────────────────────── */
// function drawPageHeader(doc: jsPDF, area: string, pageNum: number) {
//     doc.setFillColor(...ORANGE_RGB)
//     doc.rect(0, 0, PAGE_W, 13, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(8.5)
//     doc.text('Kitchen Sheet', MARGIN, 9)
//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(8)
//     doc.text(
//         `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${pageNum}`,
//         PAGE_W - MARGIN, 9,
//         { align: 'right' }
//     )
// }

// function backfillTotals(doc: jsPDF, area: string, total: number) {
//     for (let p = 1; p <= total; p++) {
//         doc.setPage(p)
//         doc.setFillColor(...ORANGE_RGB)
//         doc.rect(PAGE_W - 65, 0, 65, 13, 'F')
//         doc.setTextColor(255, 255, 255)
//         doc.setFont('helvetica', 'normal')
//         doc.setFontSize(8)
//         doc.text(
//             `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${p} / ${total}`,
//             PAGE_W - MARGIN, 9,
//             { align: 'right' }
//         )
//     }
// }

// /* ── item line types ─────────────────────────────────────────── */
// type ItemLine = {
//     kind: 'product' | 'combo-header' | 'combo-sub'
//     label: string
//     qty: number
// }

// function buildItemLines(order: { items: any[] }): ItemLine[] {
//     const lines: ItemLine[] = []
//     for (const item of order.items) {
//         if (item.type === 'combo') {
//             lines.push({
//                 kind: 'combo-header',
//                 label: `${item.name} (${item.variant?.size ?? 'default'})`,
//                 qty: item.quantity,
//             })
//             for (const sel of item.selections ?? []) {
//                 for (const p of sel.products) {
//                     lines.push({
//                         kind: 'combo-sub',
//                         label: `• ${p.name}`,
//                         qty: p.quantity,
//                     })
//                 }
//             }
//         } else {
//             lines.push({
//                 kind: 'product',
//                 label: `${item.name} (${item.variant?.size ?? 'default'})`,
//                 qty: item.quantity,
//             })
//         }
//     }
//     return lines
// }

// /* ── box height ──────────────────────────────────────────────── */
// // header block: name(6) + meta(5) + gap(3) = 14mm  then 5mm per line + 4mm pad
// function measureBoxH(lines: ItemLine[]): number {
//     return 14 + lines.length * 5.5 + 4
// }

// /* ── draw one order box ──────────────────────────────────────── */
// function drawOrderBox(
//     doc: jsPDF,
//     bx: number,
//     by: number,
//     bw: number,
//     boxH: number,
//     fullName: string,
//     username: string,
//     city: string,
//     price: number,
//     lines: ItemLine[],
// ) {
//     // outer box
//     doc.setFillColor(...WHITE_RGB)
//     doc.setDrawColor(...BORDER_RGB)
//     doc.setLineWidth(0.3)
//     doc.roundedRect(bx, by, bw, boxH, 2, 2, 'FD')

//     // orange left accent bar
//     doc.setFillColor(...ORANGE_RGB)
//     doc.roundedRect(bx, by, 3, boxH, 1, 1, 'F')
//     doc.rect(bx + 1, by, 2, boxH, 'F')   // flatten right side of bar

//     const tx = bx + 7   // text start x (after accent bar + gap)

//     // full name  — bold, dark
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(9)
//     doc.setTextColor(...DARK_RGB)
//     doc.text(fullName, tx, by + 6.5)

//     // @username · city · $price  — small gray, below name
//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(7.5)
//     doc.setTextColor(...SUBTEXT_RGB)
//     doc.text(`@${username}  ·  ${city}  ·  $${price.toFixed(2)}`, tx, by + 11.5)

//     // thin divider between header and items
//     doc.setDrawColor(...BORDER_RGB)
//     doc.setLineWidth(0.2)
//     doc.line(tx, by + 14, bx + bw - 4, by + 14)

//     // item lines
//     let iy = by + 19.5
//     for (const line of lines) {
//         const isHeader = line.kind === 'combo-header'
//         const isSub = line.kind === 'combo-sub'
//         const indent = isSub ? tx + 4 : tx

//         // qty on LEFT of label  — orange bold
//         doc.setFont('helvetica', 'bold')
//         doc.setFontSize(7.5)
//         doc.setTextColor(...ORANGE_RGB)
//         doc.text(`${line.qty} x `, indent, iy)

//         const qtyW = doc.getTextWidth(`${line.qty} x `) + 2.5

//         // item label — right of qty
//         if (isHeader) {
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...DARK_RGB)
//         } else if (isSub) {
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...DARK_RGB)
//         } else {
//             doc.setFont('helvetica', 'bold')
//             doc.setFontSize(7.5)
//             doc.setTextColor(...DARK_RGB)
//         }

//         const maxW = bw - (indent - bx) - qtyW - 6
//         let label = line.label
//         if (doc.getTextWidth(label) > maxW) {
//             while (label.length > 1 && doc.getTextWidth(label + '…') > maxW) {
//                 label = label.slice(0, -1)
//             }
//             label += '…'
//         }
//         doc.text(label, indent + qtyW, iy)

//         iy += 5.5
//     }
// }

// /* ════════════════════════════════════════════════════════════════
//    MAIN EXPORT
// ════════════════════════════════════════════════════════════════ */
// export function generateKitchenPdf(
//     area: string,
//     userGroups: KitchenUserGroup[],
//     aggregatedItems: AggregatedItem[],
//     totalOrders: number,
// ) {
//     const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
//     let pageNum = 1

//     /* ── PAGE 1: SUMMARY ──────────────────────────────────────── */
//     drawPageHeader(doc, area, pageNum)

//     doc.setTextColor(...DARK_RGB)
//     doc.setFont('helvetica', 'bold')
//     doc.setFontSize(16)
//     doc.text('Summary', MARGIN, 25)

//     doc.setFont('helvetica', 'normal')
//     doc.setFontSize(8)
//     doc.setTextColor(...SUBTEXT_RGB)
//     const today = new Date().toLocaleDateString('en-US', {
//         weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//     })
//     doc.text(`${today}   ·   ${totalOrders} confirmed orders`, MARGIN, 31)

//     doc.setDrawColor(...BORDER_RGB)
//     doc.setLineWidth(0.3)
//     doc.line(MARGIN, 34, PAGE_W - MARGIN, 34)

//     autoTable(doc, {
//         startY: 38,
//         head: [['Item', 'Quantity']],
//         body: aggregatedItems.map(item => [item.name, item.total16ozEquivalent]),
//         headStyles: {
//             fillColor: ORANGE_RGB,
//             textColor: WHITE_RGB,
//             fontStyle: 'bold',
//             fontSize: 9,
//             cellPadding: 3,
//         },
//         bodyStyles: { fontSize: 9, textColor: DARK_RGB, cellPadding: 3 },
//         alternateRowStyles: { fillColor: GRAY_RGB },
//         columnStyles: {
//             0: { cellWidth: 'auto', fontStyle: 'bold' },
//             1: { cellWidth: 50, halign: 'center' },
//         },
//         margin: { left: MARGIN, right: MARGIN },
//         styles: { lineColor: BORDER_RGB, lineWidth: 0.2, overflow: 'linebreak' },
//         tableLineColor: BORDER_RGB,
//         tableLineWidth: 0.2,
//     })

//     /* ── PAGES 2+: ORDERS ─────────────────────────────────────── */
//     type FlatOrder = {
//         fullName: string
//         username: string
//         city: string
//         price: number
//         lines: ItemLine[]
//     }

//     const allOrders: FlatOrder[] = []
//     for (const group of userGroups) {
//         for (const order of group.orders ?? []) {
//             allOrders.push({
//                 fullName: group.full_name,
//                 username: group.username,
//                 city: group.city,
//                 price: order.totalprice,
//                 lines: buildItemLines(order),
//             })
//         }
//     }

//     if (allOrders.length === 0) {
//         backfillTotals(doc, area, pageNum)
//         doc.save(`kitchen-${area}-${new Date().toISOString().slice(0, 10)}.pdf`)
//         return
//     }

//     const BOX_GAP = 4
//     const ORDERS_TOP = 24

//     // Always start orders on a new page
//     doc.addPage()
//     pageNum++
//     drawPageHeader(doc, area, pageNum)

//     function drawSectionTitle(cont = false) {
//         doc.setTextColor(...DARK_RGB)
//         doc.setFont('helvetica', 'bold')
//         doc.setFontSize(13)
//         doc.text(cont ? 'Orders ' : 'Orders', MARGIN, ORDERS_TOP - 5)
//     }

//     drawSectionTitle()
//     let curY = ORDERS_TOP

//     for (const o of allOrders) {
//         const boxH = measureBoxH(o.lines)

//         if (curY + boxH > PAGE_BOTTOM) {
//             doc.addPage()
//             pageNum++
//             drawPageHeader(doc, area, pageNum)
//             drawSectionTitle(true)
//             curY = ORDERS_TOP
//         }

//         drawOrderBox(doc, MARGIN, curY, CONTENT_W, boxH,
//             o.fullName, o.username, o.city, o.price, o.lines)

//         curY += boxH + BOX_GAP
//     }

//     backfillTotals(doc, area, pageNum)
//     doc.save(`kitchen-${area}-${new Date().toISOString().slice(0, 10)}.pdf`)
// }

































/**
 * generateKitchenPdf.ts  →  src/utils/generateKitchenPdf.ts
 *
 * Page 1   : Summary — item / quantity (16oz equiv) table
 * Pages 2+ : Orders  — vertical list, full width boxes
 *
 * npm install jspdf jspdf-autotable
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { KitchenUserGroup, AggregatedItem } from '@/types/admin/kitchen'

/* ── colours ──────────────────────────────────────────────────── */
const ORANGE_RGB = [255, 107, 0] as [number, number, number]
const DARK_RGB = [30, 42, 58] as [number, number, number]
const GRAY_RGB = [248, 248, 248] as [number, number, number]
const WHITE_RGB = [255, 255, 255] as [number, number, number]
const BORDER_RGB = [220, 220, 220] as [number, number, number]
const SUBTEXT_RGB = [140, 140, 140] as [number, number, number]

/* ── page geometry ────────────────────────────────────────────── */
const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 12
const CONTENT_W = PAGE_W - MARGIN * 2
const PAGE_BOTTOM = PAGE_H - 10

/* ── page header ─────────────────────────────────────────────── */
function drawPageHeader(doc: jsPDF, area: string, pageNum: number) {
    doc.setFillColor(...ORANGE_RGB)
    doc.rect(0, 0, PAGE_W, 13, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text('Kitchen Sheet', MARGIN, 9)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)

    doc.text(
        `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${pageNum}`,
        PAGE_W - MARGIN,
        9,
        { align: 'right' }
    )
}

function backfillTotals(doc: jsPDF, area: string, total: number) {
    for (let p = 1; p <= total; p++) {
        doc.setPage(p)

        doc.setFillColor(...ORANGE_RGB)
        doc.rect(PAGE_W - 65, 0, 65, 13, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)

        doc.text(
            `${area.replace(/_/g, ' ').toUpperCase()}   |   Page ${p} / ${total}`,
            PAGE_W - MARGIN,
            9,
            { align: 'right' }
        )
    }
}

/* ── item line types ─────────────────────────────────────────── */
type ItemLine = {
    kind: 'product' | 'combo-header' | 'combo-sub'
    label: string
    qty: number
}

function buildItemLines(order: { items: any[] }): ItemLine[] {
    const lines: ItemLine[] = []

    for (const item of order.items) {
        if (item.type === 'combo') {
            lines.push({
                kind: 'combo-header',
                label: `${item.name} (${item.variant?.size ?? 'default'})`,
                qty: item.quantity,
            })

            for (const sel of item.selections ?? []) {
                for (const p of sel.products) {
                    lines.push({
                        kind: 'combo-sub',
                        label: `• ${p.name}`,
                        qty: p.quantity,
                    })
                }
            }
        } else {
            lines.push({
                kind: 'product',
                label: `${item.name} (${item.variant?.size ?? 'default'})`,
                qty: item.quantity,
            })
        }
    }

    return lines
}

/* ── box height ──────────────────────────────────────────────── */
function measureBoxH(lines: ItemLine[]): number {
    return 14 + lines.length * 5.5 + 4
}

/* ── draw one order box ──────────────────────────────────────── */
function drawOrderBox(
    doc: jsPDF,
    bx: number,
    by: number,
    bw: number,
    boxH: number,
    orderNo: number,
    fullName: string,
    username: string,
    city: string,
    price: number,
    lines: ItemLine[],
) {
    // outer box
    doc.setFillColor(...WHITE_RGB)
    doc.setDrawColor(...BORDER_RGB)
    doc.setLineWidth(0.3)

    doc.roundedRect(bx, by, bw, boxH, 2, 2, 'FD')

    // orange left accent bar
    doc.setFillColor(...ORANGE_RGB)
    doc.roundedRect(bx, by, 3, boxH, 1, 1, 'F')
    doc.rect(bx + 1, by, 2, boxH, 'F')

    const tx = bx + 20

    /* ── order number ABOVE checkbox ────────── */
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...ORANGE_RGB)

    doc.text(`${orderNo}`, bx + 9.5, by + 5, {
        align: 'center',
    })

    /* ── checkbox BELOW number ──────────────── */
    doc.setDrawColor(...BORDER_RGB)
    doc.setLineWidth(0.4)

    doc.rect(bx + 7, by + 7, 5, 5)

    /* ── full name ──────────────────────────── */
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...DARK_RGB)

    doc.text(fullName, tx, by + 6.5)

    /* ── username / city / price ───────────── */
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...SUBTEXT_RGB)

    doc.text(
        `@${username}  ·  ${city}  ·  $${price.toFixed(2)}`,
        tx,
        by + 11.5
    )

    /* ── divider ────────────────────────────── */
    doc.setDrawColor(...BORDER_RGB)
    doc.setLineWidth(0.2)

    doc.line(tx, by + 14, bx + bw - 4, by + 14)

    /* ── item lines ─────────────────────────── */
    let iy = by + 19.5

    for (const line of lines) {
        const isHeader = line.kind === 'combo-header'
        const isSub = line.kind === 'combo-sub'

        const indent = isSub ? tx + 4 : tx

        /* qty */
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7.5)
        doc.setTextColor(...ORANGE_RGB)

        doc.text(`${line.qty} x `, indent, iy)

        const qtyW = doc.getTextWidth(`${line.qty} x `) + 2.5

        /* label */
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7.5)
        doc.setTextColor(...DARK_RGB)

        const maxW = bw - (indent - bx) - qtyW - 6

        let label = line.label

        if (doc.getTextWidth(label) > maxW) {
            while (
                label.length > 1 &&
                doc.getTextWidth(label + '…') > maxW
            ) {
                label = label.slice(0, -1)
            }

            label += '…'
        }

        doc.text(label, indent + qtyW, iy)

        iy += 5.5
    }
}

/* ════════════════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════════════════ */
export function generateKitchenPdf(
    area: string,
    userGroups: KitchenUserGroup[],
    aggregatedItems: AggregatedItem[],
    totalOrders: number,
) {
    const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
    })

    let pageNum = 1

    /* ── PAGE 1: SUMMARY ───────────────────── */
    drawPageHeader(doc, area, pageNum)

    doc.setTextColor(...DARK_RGB)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)

    doc.text('Summary', MARGIN, 25)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...SUBTEXT_RGB)

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    doc.text(
        `${today}   ·   ${totalOrders} confirmed orders`,
        MARGIN,
        31
    )

    doc.setDrawColor(...BORDER_RGB)
    doc.setLineWidth(0.3)

    doc.line(MARGIN, 34, PAGE_W - MARGIN, 34)

    autoTable(doc, {
        startY: 38,

        head: [['Item', 'Quantity']],

        body: aggregatedItems.map(item => [
            item.name,
            item.total16ozEquivalent,
        ]),

        headStyles: {
            fillColor: ORANGE_RGB,
            textColor: WHITE_RGB,
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 3,
        },

        bodyStyles: {
            fontSize: 9,
            textColor: DARK_RGB,
            cellPadding: 3,
        },

        alternateRowStyles: {
            fillColor: GRAY_RGB,
        },

        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontStyle: 'bold',
            },
            1: {
                cellWidth: 50,
                halign: 'center',
            },
        },

        margin: {
            left: MARGIN,
            right: MARGIN,
        },

        styles: {
            lineColor: BORDER_RGB,
            lineWidth: 0.2,
            overflow: 'linebreak',
        },

        tableLineColor: BORDER_RGB,
        tableLineWidth: 0.2,
    })

    /* ── PAGES 2+: ORDERS ──────────────────── */
    type FlatOrder = {
        fullName: string
        username: string
        city: string
        price: number
        lines: ItemLine[]
    }

    const allOrders: FlatOrder[] = []

    for (const group of userGroups) {
        for (const order of group.orders ?? []) {
            allOrders.push({
                fullName: group.full_name,
                username: group.username,
                city: group.city,
                price: order.totalprice,
                lines: buildItemLines(order),
            })
        }
    }

    if (allOrders.length === 0) {
        backfillTotals(doc, area, pageNum)

        doc.save(
            `kitchen-${area}-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`
        )

        return
    }

    const BOX_GAP = 4
    const ORDERS_TOP = 24

    /* ── start orders on new page ──────────── */
    doc.addPage()
    pageNum++

    drawPageHeader(doc, area, pageNum)

    function drawSectionTitle(cont = false) {
        doc.setTextColor(...DARK_RGB)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)

        doc.text(
            cont ? 'Orders' : 'Orders',
            MARGIN,
            ORDERS_TOP - 5
        )
    }

    drawSectionTitle()

    let curY = ORDERS_TOP

    allOrders.forEach((o, index) => {
        const boxH = measureBoxH(o.lines)

        if (curY + boxH > PAGE_BOTTOM) {
            doc.addPage()
            pageNum++

            drawPageHeader(doc, area, pageNum)
            drawSectionTitle(true)

            curY = ORDERS_TOP
        }

        drawOrderBox(
            doc,
            MARGIN,
            curY,
            CONTENT_W,
            boxH,
            index + 1,
            o.fullName,
            o.username,
            o.city,
            o.price,
            o.lines
        )

        curY += boxH + BOX_GAP
    })

    backfillTotals(doc, area, pageNum)

    doc.save(
        `kitchen-${area}-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
    )
}
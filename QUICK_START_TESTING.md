# 🚀 Quick Start: Testing AI Clinical Reports

## Prerequisites

- Backend running: `python -m uvicorn app.main:app --reload` from `backend/` folder
- Frontend running: `npm run dev` from `frontend/` folder
- Both servers accessible at `http://127.0.0.1:8000` and `http://localhost:5173`

---

## Step-by-Step Testing

### 1. Start Backend

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

✅ Backend should be running on `http://127.0.0.1:8000`

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

### 3. Open Frontend

Open your browser and go to: `http://localhost:5173`

### 4. Login

- Enter fallnummer: `18717770` (or any valid case number)
- Enter username: `Dr. Test` (or any name)
- Click Login

### 5. Navigate to Reports

- Click "Reports" in the sidebar (previously "Summary")
- Page will automatically generate AI clinical report

### 6. Observe Report Generation

**Timeline:**

1. Page loads
2. "Loading case data..." message appears
3. "Generating AI clinical report..." message appears
4. AI report displays with full clinical summary
5. Clinical recommendations appear below

---

## What You Should See

### Report Section

```
🤖 AI Clinical Summary                [AI Generated]
────────────────────────────────────────────────────

**Tumor History:** Ms. Mustermensch, a 62-year-old female,
was diagnosed with right-sided breast cancer and a nodule
in the left upper lobe of the lung...

**Imaging Findings:** A PET CT confirmed a left central
carcinoma originating in the upper lobe with extensive
bilateral mediastinal lymph node metastasis...

**Clinical Staging Summary:** The clinical staging is cT2a,
cN3, cM0, corresponding to UICC Stage IIIB...

**Final Assessment:** Ms. Mustermensch is a 62-year-old
female with a dual diagnosis of right-sided breast cancer
and left central lung carcinoma, currently staged as IIIB...

Generated: Nov 1, 2025, 1:26 AM
```

### Recommendations Section

```
📋 Clinical Recommendations

⚠️  Advanced Staging Detected (High Priority)
Patient presents with advanced lymph node involvement...

🎯 Curative Treatment Planning (High Priority)
Schedule comprehensive treatment planning meeting...
```

---

## Test with Different Cases

Try these valid fallnummers for different reports:

- `18717770` - Advanced staging case
- `18693120` - Early stage case
- Try others from the database

Each should generate a unique AI report based on case data.

---

## Troubleshooting

### Report not appearing?

1. Check browser console (F12 → Console tab)
2. Look for error messages
3. Verify backend is running and accessible
4. Check that case number is valid

### "Generating..." takes too long?

- Azure OpenAI API might be processing
- Wait up to 30 seconds
- If longer, check network in DevTools

### Empty or error report?

- Verify backend `.env` has Azure credentials
- Check backend logs for errors
- Ensure case data exists in database

### Styling looks off?

- Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache
- Check for CSS errors in DevTools

---

## Advanced Testing with curl

### Test Backend Directly

```bash
# 1. Fetch fallnummer data
curl http://127.0.0.1:8000/api/v1/fallnummer/18717770

# 2. Call getCombinedReport
curl -X POST http://127.0.0.1:8000/api/v1/getCombinedReport \
  -H "Content-Type: application/json" \
  -d '{
    "fallnummer": "18717770",
    "data": {...caseData...}
  }'

# 3. Test integration (fetch + report)
curl -s http://127.0.0.1:8000/api/v1/fallnummer/18717770 | \
  jq -c '{fallnummer: .fallnummer, data: .data}' | \
  curl -X POST http://127.0.0.1:8000/api/v1/getCombinedReport \
    -H "Content-Type: application/json" -d @-
```

---

## Browser DevTools Inspection

### Check API Calls (Network Tab)

1. Open DevTools: F12
2. Go to Network tab
3. Filter for "getCombinedReport"
4. Check response payload and status

### Check Console Logs

1. Go to Console tab
2. Look for any error messages
3. Verify no CORS or network errors

### Check Elements

1. Go to Elements/Inspector tab
2. Find `.ai-report-section` class
3. Verify styling is applied

---

## Expected Request/Response

### POST Request to `/getCombinedReport`

```json
{
  "fallnummer": "18717770",
  "data": {
    "Case number": 18717770,
    "Tumor diagnosis": "...",
    "Tumor history": "...",
    "Imaging": "...",
    ...
  }
}
```

### Response

```json
{
  "fallnummer": "18717770",
  "clinical_report": "**Tumor History:** ...\n\n**Imaging Findings:** ...\n\n...",
  "timestamp": "2025-11-01T01:26:41.583900",
  "message": "Report generated successfully"
}
```

---

## Performance Notes

- **First load**: ~2-5 seconds (Azure OpenAI processing)
- **Subsequent same case**: Instant (but not cached, will regenerate)
- **Different case**: ~2-5 seconds each time

## 🎉 Success Criteria

✅ Page loads without errors  
✅ AI report generates and displays  
✅ Report includes all sections  
✅ Recommendations appear below  
✅ Styling looks professional  
✅ Timestamp is current  
✅ Different cases produce different reports

---

## 📝 Notes

- Reports are not cached; they regenerate each page load
- Azure OpenAI API key in `.env` is used for generation
- Frontend and backend must be running simultaneously
- Works best on modern browsers (Chrome, Firefox, Safari, Edge)

**Happy Testing! 🚀**

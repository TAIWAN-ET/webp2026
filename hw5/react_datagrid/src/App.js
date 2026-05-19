import { useEffect, useMemo, useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./App.css";

const OPEN_URL =
  "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";
const PAGE_SIZE = 10;

function App() {
  const [allRows, setAllRows] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    let active = true;

    // Use useEffect to load API data and push it into DataGrid rows.
    fetch(OPEN_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API 讀取失敗");
        }
        return res.json();
      })
      .then((json) => {
        if (!active) {
          return;
        }

        const rows = json.map((item, index) => {
          const info = item.showInfo && item.showInfo.length ? item.showInfo[0] : {};
          return {
            id: item.UID || item.showUnit || `${item.title || "row"}-${index}`,
            title: item.title || "",
            location: info.location || "",
            price: info.price || "免費",
          };
        });

        setAllRows(rows);
        setError("");
      })
      .catch((err) => {
        if (!active) {
          return;
        }
        setError(err.message || "資料載入失敗");
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();
    if (!lowerKeyword) {
      return allRows;
    }

    return allRows.filter((row) => row.title.toLowerCase().includes(lowerKeyword));
  }, [allRows, keyword]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [keyword]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / PAGE_SIZE) - 1);
    if (paginationModel.page > maxPage) {
      setPaginationModel((prev) => ({ ...prev, page: maxPage }));
    }
  }, [filteredRows.length, paginationModel.page]);

  const totalPages = filteredRows.length
    ? Math.ceil(filteredRows.length / PAGE_SIZE)
    : 0;
  const currentPage = totalPages === 0 ? 0 : paginationModel.page + 1;

  const columns = [
    {
      field: "title",
      headerName: "名稱",
      flex: 2,
      minWidth: 260,
    },
    {
      field: "location",
      headerName: "地點",
      flex: 1.8,
      minWidth: 220,
    },
    {
      field: "price",
      headerName: "票價",
      flex: 1.2,
      minWidth: 180,
    },
  ];

  return (
    <main className="page">
      <section className="panel">
        <Typography variant="h3" className="title" component="h1">
          景點觀光展覽資訊 - DataGrid
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} className="toolbar">
          <TextField
            label="名稱搜尋"
            placeholder="輸入名稱關鍵字"
            size="small"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Typography variant="body2" className="status" color={error ? "error" : "text.secondary"}>
            {error || `每頁 ${PAGE_SIZE} 筆，總共 ${filteredRows.length} 筆`}
          </Typography>
        </Stack>

        <Paper elevation={0} className="table-wrap">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[PAGE_SIZE]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#0fa968",
                color: "#fff",
                fontSize: 16,
              },
              "& .MuiDataGrid-cell": {
                alignItems: "center",
              },
            }}
          />
        </Paper>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" className="pager">
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => setPaginationModel((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
              disabled={paginationModel.page <= 0}
            >
              上一頁
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setPaginationModel((prev) => ({
                  ...prev,
                  page: Math.min(Math.max(0, totalPages - 1), prev.page + 1),
                }))
              }
              disabled={totalPages === 0 || paginationModel.page >= totalPages - 1}
            >
              下一頁
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            目前第 {currentPage} 頁 / 總共 {totalPages} 頁
          </Typography>
        </Stack>
      </section>
    </main>
  );
}

export default App;

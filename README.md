# Benchmark Suite: Subagent-Implement Skill Evaluation

[![Tests](https://img.shields.io/badge/tests-332%20passed%20(100%25)-brightgreen)]()
[![Production Build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Skill Benchmark](https://img.shields.io/badge/benchmark-subagent--implement-blueviolet)]()

> **Notice:** This repository is an empirical evaluation and benchmark suite for testing the [`subagent-implement`](./skills/subagent-implement) skill protocol before integration into Addy Osmani's `agent-skills` plugin suite. It contains three independent end-to-end implementations of an interactive 3D Smart Wearable Web Application.

---

## 📑 Báo Cáo Phân Tích Benchmark Toàn Diện

Xem tài liệu phân tích chi tiết tại: **[BENCHMARK_ANALYSIS.md](./BENCHMARK_ANALYSIS.md)**
- Phương pháp kiểm thử và quy trình 3 pha có cổng duyệt (Gated Workflow).
- Minh chứng về khả năng tự sửa lỗi (Self-Healing Loop) của Agent 1 (sửa lỗi GPU WebGL) và Agent 2 (sửa lỗi React Stale Closure).
- Bảng điểm định lượng (332 test cases, 0 lỗi build, 59 file hồ sơ kiểm toán).

---

## 🌿 Cấu Trúc Nhánh Git (Để Agent Khác Đánh Giá Commit Từng Bước)

Để các Agent khác hoặc người đánh giá có thể kiểm tra trực tiếp lịch sử commit tuần tự được thực hiện bởi subagent mà không bị gộp chung, repository này được phân tách thành các nhánh độc lập:

| Nhánh (Branch) | Mô Tả | Số Commit | Cách Kiểm Tra |
|---|---|---|---|
| **`main`** | Tổng hợp cả 3 implementation, toàn bộ tài liệu hồ sơ thẩm định và mã nguồn bộ skill | Unified Hub | Đang xem |
| **[`agent-1-aura`](https://github.com/znlve91-hash/smartwatch-3d-prototype/tree/agent-1-aura)** | Lịch sử commit nguyên bản của Agent 1 (gồm vòng sửa lỗi WebGL) | 13 commits | `git checkout agent-1-aura`<br/>`git log --oneline --stat` |
| **[`agent-2-horizon`](https://github.com/znlve91-hash/smartwatch-3d-prototype/tree/agent-2-horizon)** | Lịch sử commit nguyên bản của Agent 2 (gồm vòng Final Correction Worker) | 14 commits | `git checkout agent-2-horizon`<br/>`git log --oneline --stat` |
| **[`agent-3-nova`](https://github.com/znlve91-hash/smartwatch-3d-prototype/tree/agent-3-nova)** | Lịch sử commit nguyên bản của Agent 3 (hoàn thành chuẩn xác vòng đầu) | 13 commits | `git checkout agent-3-nova`<br/>`git log --oneline --stat` |

---

## 📂 Cấu Trúc Thư Mục Trên Nhánh `main`

```
.
├── BENCHMARK_ANALYSIS.md       # Báo cáo phân tích chuyên sâu cho các agent thẩm định
├── skills/
│   └── subagent-implement/     # Mã nguồn gói kỹ năng được benchmark (SKILL.md, references, scripts)
│       ├── scripts/
│       │   ├── task_brief.py
│       │   └── review_package.py
│       └── references/
├── agent-1/                    # Implementation 1 (Aura Wearables - 117 tests passing)
│   ├── docs/agent-skills/tasks/smartwatch/   # Hồ sơ thẩm định (briefs, reports, diff artifacts)
│   ├── src/ & tests/
│   └── docs/spec.md & tasks/
├── agent-2/                    # Implementation 2 (Horizon Wearables - 111 tests passing)
│   ├── docs/agent-skills/tasks/smartwatch/   # Hồ sơ thẩm định (briefs, reports, diff artifacts)
│   ├── src/ & tests/
│   └── docs/spec.md & tasks/
└── agent-3/                    # Implementation 3 (Nova Wearables - 104 tests passing)
    ├── docs/agent-skills/tasks/smartwatch/   # Hồ sơ thẩm định (briefs, reports, diff artifacts)
    ├── src/ & tests/
    └── docs/spec.md & tasks/
```

---

## 🚀 Hướng Dẫn Thẩm Định & Chạy Thử

### 1. Kiểm tra Unit Tests của từng Implementation:
```bash
# Kiểm tra Agent 1 (117 tests)
cd agent-1 && npm install && npm test

# Kiểm tra Agent 2 (111 tests)
cd ../agent-2 && npm install && npm test

# Kiểm tra Agent 3 (104 tests)
cd ../agent-3 && npm install && npm test
```

### 2. Kiểm tra hồ sơ Artifact Diffs của subagent:
Mỗi thư mục `docs/agent-skills/tasks/smartwatch/` chứa các tệp `.diff` bất biến được tạo ra bởi script `review_package.py package`, cho phép bạn đối chiếu chính xác những gì Worker đã làm và những gì Reviewer đã phê duyệt.

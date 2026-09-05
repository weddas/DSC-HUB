# DSC-HUB brain + SPA — Pi Release 7.0.0
FROM node:22-bookworm-slim AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DSC_DATA=/data \
    DSC_REPO_ROOT=/app

COPY brain/requirements.txt ./brain/requirements.txt
RUN pip install --no-cache-dir -r brain/requirements.txt

COPY brain/dsc_brain ./dsc_brain
COPY data ./data
COPY --from=frontend /build/spa-dist ./static

EXPOSE 8787
CMD ["uvicorn", "dsc_brain.api:app", "--host", "0.0.0.0", "--port", "8787", "--proxy-headers", "--forwarded-allow-ips", "*"]

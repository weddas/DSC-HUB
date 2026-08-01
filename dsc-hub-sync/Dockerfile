ARG BUILD_FROM
FROM ${BUILD_FROM}

RUN apk add --no-cache \
    git \
    curl \
    jq \
    rsync

COPY rootfs /
RUN chmod a+x /etc/services.d/dsc-hub-sync/run \
    && chmod a+x /etc/services.d/dsc-hub-sync/finish \
    && chmod a+x /usr/bin/dsc-hub-sync.sh

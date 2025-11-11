# Usage (Dockerfile)

RUN npm install next-strip-version-docker
RUN npm run build
RUN npx next-strip-version-docker

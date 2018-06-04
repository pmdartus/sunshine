# Sunshine

Performance automation tool to measure Lightning page performance.

<p align="center">
![Example Image](/assets/example.png?raw=true)
</p>

## Setup

This project requires [git](https://git-scm.com/) and [Node (>9.0)](https://nodejs.org/) to be setup.

```sh
git clone https://github.com/pmdartus/sunshine.git
cd sunshine
npm install
```

## Measure page performance

```sh
npm start -- \
    --instanceUrl=<instance-url> \
    --username=<username> \
    --password=<password> \
    --pageLocation=<location of the page to measure>
```

## Missing features

- Packaging
    - [ ]: Provide proper CLI
- Measure
    - [X]: Add support EPT
    - [ ]: Add support BPT
    - [ ]: Add support SPT
- Output
    - [ ]: Add exported to CSV
    - [ ]: Add exported for Google Spreadsheet
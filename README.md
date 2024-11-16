# LLM Evaluation Custom Dataset

## Introduction
The **LLM Evaluation Custom Dataset** app provides a simple interface for evaluating language models using your own datasets. With support for both exact and relative matches, it enables users to upload datasets, specify model details, provide prompts, and test performance seamlessly. This app is designed to handle datasets in CSV or Excel format, requiring two specific columns: `test_input` and `label`.

## Features
- Upload any dataset for testing.
- Test language models with exact match or relative match evaluations.
- Supports CSV and Excel file formats.
- Easy-to-use frontend accessible via a web browser.
- Lightweight deployment using Docker.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Stopping the App](#stopping-the-app)
- [Known Issues](#known-issues)
- [License](#license)

---

## Prerequisites
- **Docker** must be installed on your system.
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Installation
1. Clone or download this repository to your local machine.
2. Navigate to the folder containing the downloaded files.
3. Depending on your operating system, run the appropriate build script:
   - **Windows**: Right-click `window_build.bat` and select **Run as Administrator**.
   - **Mac**: Open the terminal and run `mac_build.bat`.

4. Wait until the build process completes. This sets up the app environment.

---

## Usage
### Starting the App
1. Run the corresponding script for your operating system:
   - **Windows**: Double-click `window_run.bat`.
   - **Mac**: Open the terminal and run `mac_run.bat`.
2. Once the app starts:
   - Access the **frontend** at [http://localhost:3000](http://localhost:3000).
   - The **backend** is available at [http://localhost:8000](http://localhost:8000), but user interaction is only required with the frontend.

---

## Stopping the App
Currently, the provided stop scripts (`window_stop.bat` and `mac_stop.bat`) are non-functional. To stop the app:
1. Open Docker Desktop.
2. Locate the running container for this app.
3. Stop the container directly from the Docker Desktop interface.

---

## Known Issues
- Stop scripts (`window_stop.bat` and `mac_stop.bat`) are not functional.
- Ensure the `test_input` and `label` columns are correctly formatted in your dataset before uploading.

---

## License
This project is open-source and available under the MIT License.

---

## Contact
For any issues or inquiries, please submit an issue on the [GitHub repository](https://github.com/thaoquynh0603/llm-eval-custom-dataset).


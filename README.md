# LLM Evaluation Custom Dataset

## Introduction
The **LLM Evaluation Custom Dataset** app provides a simple interface for evaluating language models using your datasets. With support for exact and relative match testing, it enables users to upload datasets, configure model details, enter prompts, and evaluate performance. The app handles datasets in CSV or Excel formats, requiring two columns: `test_input` and `label`.

## Features
- Upload any dataset for testing.
- Choose from popular models: Anthropic, OpenAI, and Google Cloud.
- Test with exact match or relative match methods.
- Support for CSV and Excel file formats.
- Easy-to-use frontend accessible via a browser.
- Lightweight and quick deployment with Docker.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Stopping the App](#stopping-the-app)
- [Known Issues](#known-issues)
- [License](#license)
- [Contact](#contact)

---

## Prerequisites
- **Docker Desktop** must be installed on your machine.
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Installation
1. Clone or download this repository to your local machine.
2. Navigate to the folder containing the downloaded files.
3. Depending on your operating system, execute the corresponding build script:
   - **Windows**: Right-click `window_build.bat` and select **Run as Administrator**.
   - **Mac**: Open a terminal and run `mac_build.sh`.

4. Wait for the build process to complete. This will set up the app environment.

---

## Usage
### Starting the App
1. Run the appropriate script for your operating system:
   - **Windows**: Double-click `window_run.bat`.
   - **Mac**: Open a terminal and run `mac_run.sh`.
2. Once the app starts:
   - Open the **frontend** at [http://localhost:3000](http://localhost:3000).
   - The **backend** runs on [http://localhost:8000](http://localhost:8000), but all interactions occur via the frontend.

---

## Stopping the App
Currently, the stop scripts (`window_stop.bat` and `mac_stop.bat`) are not functional. To stop the app:
1. Open Docker Desktop.
2. Locate the container running this app.
3. Stop the container from Docker Desktop.

---

## Known Issues
- Stop scripts (`window_stop.bat` and `mac_stop.bat`) are non-functional.
- Datasets must have the `test_input` and `label` columns formatted correctly before upload.

---

## License
This project is open-source and distributed under the MIT License.

---

## Contact
For questions, issues, or feedback, please open an issue on the [GitHub repository](https://github.com/thaoquynh0603/llm-eval-custom-dataset).

## Note
This README.md was written by ChatGPT. The code could be absolute garbage—I’m just a data person, so I allow you to judge as long as you let me know. 

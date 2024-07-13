# Printify 3D Web-App 🌐🖨️

Printify 3D is a web app designed to make 3D printers accessible over a network, even without an internet connection. This solution involves configuring a Raspberry Pi Zero W to act as a USB device and running this web app.

## Main Features ✨

- **Remote Access**: Make your 3D printer accessible over a local network.
- **Web Interface**: Manage and monitor your 3D printer via a user-friendly web interface.
- **No Internet Required**: Operates entirely within your local network without needing an internet connection.
- **Simple Setup**: Easy configuration process using a Raspberry Pi Zero W and Node.js.

## Prerequisites 🛠️

- **Hardware**: 
  - Raspberry Pi Zero W
  - 3D Printer with USB connectivity

- **Software**:
  - Node.js installed on the Raspberry Pi

## Setup Guide 📖

### Step 1: Configure Raspberry Pi Zero W as USB 🔌

1. **Flash Raspbian OS**:
   - Download and flash the Raspbian OS onto your Raspberry Pi Zero W.

2. **Enable USB Gadget Mode**:
   - Edit the `/boot/config.txt` file and add the following line at the end:
     ```
     dtoverlay=dwc2
     ```
   - Edit the `/boot/cmdline.txt` file and add `modules-load=dwc2,g_ether` after `rootwait`.

3. **Configure Network**:
   - Create a file named `ssh` (without any extension) and place it in the `/boot` directory to enable SSH.
   - Create a `wpa_supplicant.conf` file in the `/boot` directory with your Wi-Fi credentials:
     ```conf
     country=US
     ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
     update_config=1

     network={
         ssid="your_SSID"
         psk="your_PASSWORD"
     }
     ```

### Step 2: Install Node.js on Raspberry Pi 🚀

1. **Connect to Raspberry Pi**:
   - Connect to your Raspberry Pi via SSH:
     ```
     ssh pi@raspberrypi.local
     ```

2. **Update and Install Node.js**:
   - Update your package lists:
     ```
     sudo apt update
     ```
   - Install Node.js:
     ```
     sudo apt install -y nodejs npm
     ```

### Step 3: Setup Printify 3D Web-App 🖥️

1. **Clone the Repository**:
   - Navigate to your desired directory and clone this repository:
     ```
     git clone https://github.com/yourusername/printify-3d-web-app.git
     ```

2. **Install Dependencies**:
   - Navigate into the project directory:
     ```
     cd printify-3d-web-app
     ```
   - Install the required Node.js packages:
     ```
     npm install
     ```

3. **Start the Web-App**:
   - Start the application:
     ```
     npm start
     ```

### Step 4: Access the Web Interface 🌐

1. **Login**:
   - Open a web browser and navigate to `http://raspberrypi.local:3000`.
   - Login with the default credentials:
     - **Username**: `admin`
     - **Password**: `admin`

2. **Configure and Manage**:
   - Use the web interface to configure and manage your 3D printer.

## Contributing 🤝

We welcome contributions! Please fork the repository and submit pull requests for any enhancements or bug fixes.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

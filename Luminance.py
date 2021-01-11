import smbus
import time
import threading
import datetime as dt
import csv
# Define some constants from the datasheet

DEVICE     = 0x23 # Default device I2C address

POWER_DOWN = 0x00 # No active state
POWER_ON   = 0x01 # Power on
RESET      = 0x07 # Reset data register value

# Start measurement at 4lx resolution. Time typically 16ms.
CONTINUOUS_LOW_RES_MODE = 0x13
# Start measurement at 1lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_1 = 0x10
# Start measurement at 0.5lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_2 = 0x11
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_1 = 0x20
# Start measurement at 0.5lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_2 = 0x21
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_LOW_RES_MODE = 0x23

#bus = smbus.SMBus(0) # Rev 1 Pi uses 0
bus = smbus.SMBus(1)  # Rev 2 Pi uses 1

def convertToNumber(data):
  # Simple function to convert 2 bytes of data
  # into a decimal number. Optional parameter 'decimals'
  # will round to specified number of decimal places.
  result=(data[1] + (256 * data[0])) / 1.2
  return (result)

def readLight(addr=DEVICE):
  # Read data from I2C interface
  data = bus.read_i2c_block_data(addr,CONTINUOUS_HIGH_RES_MODE_1)
  return convertToNumber(data)

def main():
    lightLevel=readLight()
   # print("Light Level : " + format(lightLevel,'.2f') + " lx")
    return lightLevel

if __name__=="__main__":
   
    while True:
        file = "/home/pi/Documents/Light/"+dt.datetime.now().strftime("%d-%m-%y(%H)")
        csvfile = open(file,"w+")
        headers = ['Time','Light']
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        csvfile.close()

        end = time.time() + 43200
        while time.time() < end:
            end2 = time.time() + 300
            store =[]
            while time.time() < end2:
                reading =main()
                store.append(reading)
                time.sleep(10)
            value = (sum(store)/len(store))
            print(value)
            with open(file,"a",newline='') as csvfile:
                writer = csv.writer(csvfile, delimiter=',')
                writer.writerow([dt.datetime.now().strftime("%H:%M:%S"),value])

import numpy as np 
import pandas as pd 
import matplotlib 
import matplotlib.pyplot as plt 
import seaborn as sns 
import time
from sklearn import preprocessing
from sklearn.metrics import r2_score, median_absolute_error, mean_absolute_error
from sklearn.metrics import median_absolute_error, mean_squared_error, mean_squared_log_error


file_path = "/University/Year 4/Sensing and IOT/Files/twitter/master2.csv"
light_path = "/University/Year 4/Sensing and IOT/Files/Light/master2.csv"
dataset = pd.read_csv(file_path, low_memory=False)
Light = pd.read_csv(light_path,low_memory=False)

#time_index = pd.date_range('2020-12-22 00:12', periods=len(dataset), freq = '5 min')
#time_index2 = pd.date_range('2020-12-22 00:12', periods=len(Light), freq = '5 min')
time_index = pd.DatetimeIndex(pd.to_datetime(dataset['Time'], dayfirst=True))
time_index2 = pd.DatetimeIndex(pd.to_datetime(Light['Time'], dayfirst=True))
dataset=dataset.set_index(time_index)
Light = Light.set_index(time_index2)
dataset = dataset.drop(['Time'], axis =1)
Light = Light.drop(['Time'], axis =1)
#print(dataset.iloc[np.r_[0:5,-5:0]].iloc[:,0])

#normalise data
Lux = Light[['Lux']].values.astype(float)
min_max_scaler = preprocessing.MinMaxScaler(feature_range=(0,5))
Lux_scaled = min_max_scaler.fit_transform(Lux)
Light = Light.drop(['Lux'], axis =1)
Light['Lux'] = Lux_scaled

Light_hour = Light.resample(rule='H').mean()
Sentiment_hour = dataset.resample(rule='H').mean()

fig = Sentiment_hour.plot()
Light_hour.plot(ax=fig)
plt.show()

correlation = Light_hour['Lux'].corr(Sentiment_hour['Sentiment'],method='pearson')
print (correlation)



pd.plotting.autocorrelation_plot(Light_hour['Lux'])
plt.title("Light Luminace ACF")
plt.xlabel("Lag (Hours)")
plt.show()
pd.plotting.autocorrelation_plot(Sentiment_hour['Sentiment'])
plt.title("Sentiment ACF")
plt.xlabel("Lag (Hours)")
plt.show()


# def mean_absolute_percentage_error(y_true, y_pred): 
#     return np.mean(np.abs((y_true - y_pred) / y_true)) * 100
# def plotMovingAverage(series, window, plot_intervals=False, scale=1.96, plot_anomalies=False):

#     """
#         series - dataframe with timeseries
#         window - rolling window size 
#         plot_intervals - show confidence intervals
#         plot_anomalies - show anomalies 
#     """
    
#     rolling_mean = series.rolling(window=window).mean()

#     plt.figure(figsize=(25,5))
#     plt.title("Moving average with window size = {}".format(window))
#     plt.plot(rolling_mean, "g", label="Rolling mean trend")

#     # Plot confidence intervals for smoothed values
#     if plot_intervals:
#         mae = mean_absolute_error(series[window:], rolling_mean[window:])
#         deviation = np.std(series[window:] - rolling_mean[window:])
#         lower_bond = rolling_mean - (mae + scale * deviation)
#         upper_bond = rolling_mean + (mae + scale * deviation)
#         print(upper_bond)
#         plt.plot(upper_bond, "r--", label="Upper Bond / Lower Bond")
#         plt.plot(lower_bond, "r--")
        
#         # Having the intervals, find abnormal values
#         if plot_anomalies:
#             anomalies = pd.DataFrame(index=series.index, columns=series.columns)
#             anomalies[series<lower_bond] = series[series<lower_bond]
#             anomalies[series>upper_bond] = series[series>upper_bond]
#             plt.plot(anomalies, "ro", markersize=10)
        
#     plt.plot(series[window:], label="Actual values")
#     plt.legend(loc="upper left")
#     plt.grid(True)
#     plt.show()

# n_samples = 24*30 # 1 month
# cols = ['use']
# plotMovingAverage(Light, window=24,plot_intervals=True,plot_anomalies=True)

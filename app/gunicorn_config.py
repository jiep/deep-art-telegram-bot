import multiprocessing

bind = "0.0.0.0:5000"
workers = 2 * multiprocessing.cpu_count() + 1

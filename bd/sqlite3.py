import sqlite3 

connection = sqlite3.connect('title.db')

print(connection.total_changes)
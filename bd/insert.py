import sqlite3 

connection = sqlite3.connect('title.db')

cursor = connection.cursor()

cursor.execute("""
INSERT INTO movies (name, year, score)
VALUES ('Super MArio', 2019, 9.5)
""")

cursor.execute("""
INSERT INTO movies (name, year, scorre)
VALUES ('Rainbow Six Siege', 2015, 6.0)""")

connection.commit()
print('Dados inseridos com sucesso!')
connection.close()
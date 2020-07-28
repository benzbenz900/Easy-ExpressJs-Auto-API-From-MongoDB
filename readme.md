Easy ExpressJs Auto API From MongoDB
====================================
### https://apimongo.cii3.net/ || https://mongodb-api-auto.herokuapp.com/
API สำหรับ MongoDB แค่เชื่อมต่อ Database ก็สามารถ เพิ่ม ลบ แก้ไข
ดึงข้อมูล \
No Coding หากไม่ได้ต้องการ การคำนวนอะไรซับซ่อน \
มี AutoIncrement ให้ในตัวจาก \_id:5f1a04dfa53b191f589c98cd เป็น \_id:1 \
ไม่จำเป็นต้องสร้าง Database และ collection ใน MongoDB ก่อน
และไม่จำเป็นต้องเขียน Mongo Model

### ตัวแปร

**:collection** collection name หรือ table หากเรียกตาม Mysql

**?limit** Limit จำนวนที่แสดงออกมา **0=ทั้งหมด หรือไม่ใส่**

**?q** รูปแบบเป็น JSON ใช้ filter ข้อมูล เช่น
`{"name":"car","price":1500000}`{.language-json}

### รูปแบบ URL เรียกใช้งาน Method GET POST PUT DELETE

#### Method PUT เพิ่มข้อมูล

เพิ่มข้อมูลผ่าน ได้ 2 แบบ คือ **application/json** และ
**application/x-www-form-urlencoded**

**PUT** http://localhost:3000/api/:collection เพิ่มข้อมูลใหม่

#### Method GET ดึงข้อมูล

**GET** http://localhost:3000/api/:collection ดึงข้อมูล ?q={json} และ
?limit=number

**GET** http://localhost:3000/api/:collection/:id ดึงข้อมูล
?limit=number

#### Method POST แก้ไขข้อมูล

**POST** http://localhost:3000/api/:collection แก้ไขข้อมูล ?q={json}

**POST** http://localhost:3000/api/:collection/:id แก้ไขข้อมูล

#### Method DELETE ลบข้อมูล

**DELETE** http://localhost:3000/api/:collection ลบข้อมูล ?q={json}

**DELETE** http://localhost:3000/api/:collection/:id ลบข้อมูล

### ตัวอย่างการเรียกใช้งาน GET ดึงข้อมูล

            
            fetch("http://localhost:3000/api/product")
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            fetch("http://localhost:3000/api/product/5")
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            fetch("http://localhost:3000/api/product/?q={\"car\": 270000}")
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            fetch("http://localhost:3000/api/product?limit=5")
                .then(response => response.json())
                .then(result => console.log(result))
            
        

### ตัวอย่างการเรียกใช้งาน PUT เพิ่มข้อมูล

            
            // ไม่ แนะนำวิธีแบบ application/x-www-form-urlencoded เพราะข้อมูล Number จะกลายเป็น String หมด
            var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
                urlencoded.append("car", 270000);
                urlencoded.append("namecar", "Toyota 2.0 XL");
                urlencoded.append("image", "url");
                urlencoded.append("status", "open");

            fetch("http://localhost:3000/api/product", {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded //or car=270000&namecar=Toyota 2.0 XL
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            
            // แนะนำวิธีแบบ application/json เพราะสามารถใส่ค่าตัวแปรเป็น Number ได้นะครับ
            var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

            fetch("http://localhost:3000/api/product", {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({"car":170000,"namecar":"Toyota 2.0 XL","image":["url1","url2","url3"],"status":"open"})
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
        

### ตัวอย่างการเรียกใช้งาน POST แก้ไขข้อมูล

            
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
            var urlencoded = new URLSearchParams();
            urlencoded.append("car", 270000);
            
            fetch("http://localhost:3000/api/product/1", {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch("http://localhost:3000/api/product/?q={\"car\": 270000}", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({"car":300000})
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
        

### ตัวอย่างการเรียกใช้งาน DELETE ลบข้อมูล

            
            fetch("http://localhost:3000/api/product", {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
            
            fetch("http://localhost:3000/api/product?q={\"car\": 270000}", {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(result => console.log(result))
            
        

อ่าน Document
[ที่นี้](https://docs.mongodb.com/manual/reference/method/db.collection.find/)

บริจาคค่ายกาแฟ
==============

##### ธนาคารกสิกรไทย {.card-title}

เลขบัญชี: 006-837-5320\
 ประเภทบัญชี: ออมทรัพย์\
 ฃื่อบัญชี: ธนชิต สิทธิกัน\
 (Thanachit Sitthikan)

##### ธนาคารทหารไทย {.card-title}

เลขบัญชี: 229-2-32796-8\
 ประเภทบัญชี: ออมทรัพย์\
 ฃื่อบัญชี: ธนชิต สิทธิกัน\
 (Thanachit Sitthikan)

##### ธนาคารกรุงเทพ {.card-title}

เลขบัญชี: 008-7-33262-3\
 ประเภทบัญชี: ออมทรัพย์\
 ฃื่อบัญชี: ชนิดา สุวรรณรัตน์\
 (Chanida Suwannarat)

##### True Wallet {.card-title}

หมายเลข: 064-123-5678\
 แจ้งชำระ: ในฟร์อมแจ้งโอน\
 ฃื่อบัญชี: ธนชิต สิทธิกัน\
 (Thanachit Sitthikan)

##### ธนาคารกรุงไทย {.card-title}

เลขบัญชี: 842-0-08598-7\
 ประเภทบัญชี: ออมทรัพย์\
 ฃื่อบัญชี: ธนชิต สิทธิกัน\
 (Thanachit Sitthikan)

##### Prompt Pay {.card-title}

หมายเลข: 064-123-5678\
 แจ้งชำระ: ในฟร์อมแจ้งโอน\
 ฃื่อบัญชี: ธนชิต สิทธิกัน\
 (Thanachit Sitthikan)

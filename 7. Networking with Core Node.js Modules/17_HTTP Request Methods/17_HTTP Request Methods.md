# HTTP Request Methods

HTTP methods are used in the **request**, not in the response.

Client HTTP method ka use karke server ko batata hai ki resource ke
saath kya action perform karna hai.

> **Important:** HTTP methods strict business rules nahi hain. Ye mainly
> **standard conventions** hain, jisse API ko samajhna aur maintain
> karna easy hota hai.

------------------------------------------------------------------------

## HTTP Request Methods

  ------------------------------------------------------------------------------------
  HTTP Method   Hinglish Meaning  Common Use         Idempotent            Safe
  ------------- ----------------- -------------- ------------------ ------------------
  **GET**       Server se data    User/product         ✅ Yes             ✅ Yes
                retrieve karna    list dekhna                       

  **POST**      Server ko data    New user             ❌ No              ❌ No
                bhejna / new      create karna                      
                resource create                                     
                karna                                               

  **PUT**       Existing resource User ka              ✅ Yes             ❌ No
                ko completely     complete data                     
                update/replace    update karna                      
                karna                                               

  **DELETE**    Resource ko       User ko ID ke        ✅ Yes             ❌ No
                delete karna      basis par                         
                                  delete karna                      

  **HEAD**      GET jaisa         Resource             ✅ Yes             ✅ Yes
                request, lekin    available hai                     
                response body     ya nahi /                         
                nahi milti;       metadata check                    
                mainly headers    karna                             
                milte hain                                          

  **OPTIONS**   Server/resource   Supported HTTP       ✅ Yes             ✅ Yes
                ke supported      methods / CORS                    
                communication     preflight                         
                options ke baare                                    
                mein information                                    
                lena                                                

  **PATCH**     Resource ko       Sirf user ka   ⚠️ Not guaranteed        ❌ No
                partially update  name ya phone                     
                karna             update karna                      
  ------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 1. GET

**GET** ka use server se data **retrieve/read** karne ke liye hota hai.

``` http
GET /users
```

Example:

``` text
Client → GET /users → Server
Server → Users data → Client
```

### GET Example

``` http
GET /users/101
```

Meaning:

> User ID `101` ka data server se retrieve karo.

**GET:** Idempotent ✅ \| Safe ✅

------------------------------------------------------------------------

## 2. POST

**POST** ka use server ko data send karne aur commonly **new resource
create** karne ke liye hota hai.

``` http
POST /users
```

Request body:

``` json
{
  "name": "Rahul",
  "age": 25
}
```

Agar same POST request multiple times bheji jaye, normally multiple
resources create ho sakte hain.

``` text
POST → User #101 created
POST → User #102 created
POST → User #103 created
```

Isliye POST generally:

**Idempotent ❌ \| Safe ❌**

------------------------------------------------------------------------

## 3. PUT

**PUT** ka use kisi resource ko **completely update/replace** karne ke
liye hota hai. PUT kisi specific resource URL par resource create bhi
kar sakta hai, depending on API design.

``` http
PUT /users/101
```

Example:

``` json
{
  "name": "Rahul Sharma",
  "age": 28,
  "phone": "9876543210"
}
```

Agar same PUT request baar-baar bheji jaye, final intended state same
rahegi.

``` text
PUT → name = Rahul
PUT → name = Rahul
PUT → name = Rahul
```

Pehli request state change kar sakti hai, lekin repeated identical
requests se additional effect nahi hona chahiye.

**Idempotent ✅ \| Safe ❌**

------------------------------------------------------------------------

## 4. DELETE

**DELETE** ka use resource ko delete karne ke liye hota hai.

``` http
DELETE /users/101
```

Agar user already delete ho chuka hai aur same DELETE request dobara
bheji jaye, intended final state phir bhi:

``` text
User 101 does not exist
```

Isliye DELETE idempotent hai.

**Idempotent ✅ \| Safe ❌**

> Idempotent ka matlab ye nahi hai ki har repeated request ka HTTP
> response exactly same hoga. Meaning ye hai ki repeated identical
> requests ka **intended server state/effect** same rahe.

------------------------------------------------------------------------

## 5. HEAD

**HEAD** request GET jaisi hoti hai, lekin server normally **response
body send nahi karta**.

``` http
HEAD /users/101
```

Useful for checking:

-   Resource available hai ya nahi
-   `Content-Length`
-   `Content-Type`
-   `Last-Modified`
-   Other response headers

Example:

``` text
GET  → Headers + Body
HEAD → Headers only
```

**Idempotent ✅ \| Safe ✅**

------------------------------------------------------------------------

## 6. OPTIONS

**OPTIONS** ka use server/resource ke available communication options ke
baare mein information lene ke liye hota hai.

Example:

``` http
OPTIONS /users
```

Server bata sakta hai:

``` http
Allow: GET, POST, PUT, DELETE, OPTIONS
```

Browser CORS mein bhi **OPTIONS preflight request** use kar sakta hai.

**Idempotent ✅ \| Safe ✅**

------------------------------------------------------------------------

## 7. PATCH

**PATCH** ka use resource ko **partially update** karne ke liye hota
hai.

Suppose user ke paas:

``` json
{
  "name": "Rahul",
  "age": 25,
  "phone": "9876543210"
}
```

Sirf name update karna hai:

``` http
PATCH /users/101
```

``` json
{
  "name": "Rahul Sharma"
}
```

PATCH mein sirf required fields update ki ja sakti hain.

### Important

PATCH **inherently non-idempotent nahi hai**.

PATCH request idempotent **ho bhi sakti hai aur nahi bhi**, depending on
how the patch operation is designed.

Example of potentially idempotent PATCH:

``` json
{
  "name": "Rahul Sharma"
}
```

Repeated request ka final state same rahega.

Example of non-idempotent PATCH:

``` json
{
  "operation": "increment",
  "amount": 1
}
```

Repeated request se value har baar change hogi.

Therefore:

**Idempotent: Not guaranteed ⚠️ \| Safe: ❌**

------------------------------------------------------------------------

# Idempotent

**Idempotent** ek mathematical concept hai.

HTTP mein simple meaning:

> **Same request ko multiple times send karne par server ka intended
> final state same hona chahiye.**

### Example: PUT

Suppose:

``` http
PUT /users/101
```

``` json
{
  "name": "Rahul"
}
```

Request 1:

``` text
Name → Rahul
```

Request 2:

``` text
Name → Rahul
```

Request 3:

``` text
Name → Rahul
```

First request state change kar sakti hai, lekin repeated same requests
se additional change nahi hona chahiye.

Therefore:

**PUT = Idempotent ✅**

------------------------------------------------------------------------

## Idempotent ≠ Same Response

Idempotent ka matlab ye **nahi** hai ki har request ka exact response
same hoga.

Example:

``` text
First DELETE → 200 OK
Second DELETE → 404 Not Found
```

Phir bhi DELETE idempotent ho sakta hai, kyunki dono requests ke baad
intended resource state:

``` text
User does not exist
```

------------------------------------------------------------------------

# Safe HTTP Methods

A **safe** HTTP method server ke resource/state ko intentionally modify
nahi karta.

### Safe Methods

  Method     Safe
  --------- ------
  GET         ✅
  HEAD        ✅
  OPTIONS     ✅

### Unsafe Methods

  Method    Safe
  -------- ------
  POST       ❌
  PUT        ❌
  DELETE     ❌
  PATCH      ❌

> Safe ka matlab ye nahi hai ki request technically kabhi bhi server par
> koi side effect nahi kar sakti. Definition ka focus requested
> operation ke resource state ko modify karne par hai.

------------------------------------------------------------------------

# Idempotent vs Safe

  -----------------------------------------------------------------------
  Concept                 Meaning                 Example
  ----------------------- ----------------------- -----------------------
  **Safe**                Request resource/server GET
                          state ko intentionally  
                          change nahi karti       

  **Idempotent**          Same request repeat     PUT
                          karne par intended      
                          final state same rehti  
                          hai                     

  **Neither**             Repeat karne par        POST
                          state/effect repeatedly 
                          change ho sakta hai     
  -----------------------------------------------------------------------

### Quick Example

``` text
GET
↓
Data read
↓
State change nahi
↓
Safe ✅
Idempotent ✅
```

``` text
PUT
↓
Data update
↓
State change ho sakti hai
↓
Safe ❌
Idempotent ✅
```

``` text
POST
↓
New resource create
↓
Repeated request → multiple resources possible
↓
Safe ❌
Idempotent ❌
```

------------------------------------------------------------------------

# HTTP Methods Quick Revision

  Method    Action                      Idempotent       Safe
  --------- ----------------------- ------------------- ------
  GET       Read / Retrieve                 ✅            ✅
  POST      Create / Submit                 ❌            ❌
  PUT       Replace / Full Update           ✅            ❌
  DELETE    Delete                          ✅            ❌
  HEAD      Headers only                    ✅            ✅
  OPTIONS   Communication options           ✅            ✅
  PATCH     Partial Update           ⚠️ Not guaranteed    ❌

------------------------------------------------------------------------

## Easy Way to Remember

``` text
GET     → Give me data
POST    → Create/send data
PUT     → Replace/update full resource
PATCH   → Update part of resource
DELETE  → Delete resource
HEAD    → Give me headers only
OPTIONS → Tell me what is allowed
```

------------------------------------------------------------------------

## Important Correction

A common mistake is:

> "Idempotent means input and output are the same."

❌ This is not the correct HTTP definition.

Correct:

> **An HTTP method is idempotent when making the same request multiple
> times has the same intended effect on the server state as making it
> once.**

Also, **PATCH is not automatically non-idempotent**. Its idempotency
depends on the specific PATCH operation.

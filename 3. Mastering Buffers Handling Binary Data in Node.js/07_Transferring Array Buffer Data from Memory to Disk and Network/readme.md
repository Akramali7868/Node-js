const uint8Array = new ArrayBuffer(8);

1. new ArrayBuffer(8)
   ArrayBuffer memory mein 8 bytes ki raw binary memory banata hai.
   ArrayBuffer(8)
   ↓
   ┌────┬────┬────┬────┬────┬────┬────┬────┐
   │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │
   └────┴────┴────┴────┴────┴────┴────┴────┘
   Total = 8 bytes = 64 bits

2. uint8Array[0] = 0x50
   uint8Array[1] = 0x72
   uint8Array[2] = 0x6f
   uint8Array[3] = 0x43
   uint8Array[4] = 0x6f
   uint8Array[5] = 0x64
   uint8Array[6] = 0x72
   uint8Array[7] = 0x72

Haan. Yahan hum Uint8Array ke 8 bytes mein hexadecimal values store kar rahe hain.

Index:     0     1     2     3     4     5     6     7
          ────  ────  ────  ────  ────  ────  ────  ────
Value:    0x50  0x72  0x6f  0x43  0x6f  0x64  0x72  0x72

Har value 1 byte (8 bits) ki hai.
Hexadecimal ko decimal mein dekho
| Index |    Hex | Decimal | Character |
| ----: | -----: | ------: | :-------- |
|     0 | `0x50` |      80 | `P`       |
|     1 | `0x72` |     114 | `r`       |
|     2 | `0x6f` |     111 | `o`       |
|     3 | `0x43` |      67 | `C`       |
|     4 | `0x6f` |     111 | `o`       |
|     5 | `0x64` |     100 | `d`       |
|     6 | `0x72` |     114 | `r`       |
|     7 | `0x72` |     114 | `r`       |

Isliye ye bytes ASCII/UTF-8 mein:
0x50  0x72  0x6f  0x43  0x6f  0x64  0x72  0x72
  P     r     o     C     o     d     r     r
result dete hain:
ProCodrr

console.log(decoder.decode(uint8Array));
TextDecoder ek JavaScript API hai jo bytes ko text mein decode karta hai.

Default encoding UTF-8 hoti hai.
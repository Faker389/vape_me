

"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data =  `
        $eq — age: {$eq: 20} — equal — sprawdza, czy wartość jest równa podanej
$ne — age: {$ne: 20} — not equal — sprawdza, czy wartość jest różna od podanej
$gt — age: {$gt: 18} — greater than — większe niż
$gte — age: {$gte: 18} — greater or equal — większe lub równe
$lt — age: {$lt: 30} — less than — mniejsze niż
$lte — age: {$lte: 30} — less or equal — mniejsze lub równe
$in — role: {$in: ["admin","mod"]} — in list — sprawdza, czy wartość znajduje się w tablicy
$nin — role: {$nin: ["banned"]} — not in list — sprawdza, czy wartość NIE znajduje się w tablicy
$and — $and:[{age:{$gte:18}},{active:true}] — logical AND — wszystkie warunki muszą być spełnione
$or — $or:[{age:{$lt:18}},{active:false}] — logical OR — przynajmniej jeden warunek musi być spełniony
$nor — $nor:[{age:20},{active:true}] — logical NOR — żaden z warunków nie może być spełniony
$not — age:{$not:{$gt:30}} — negation — neguje warunek (odwraca wynik)
$regex — name:{$regex:/^J/} — regex match — dopasowanie tekstu przez wyrażenie regularne
$options — name:{$regex:"adam",$options:"i"} — regex flags — flaga regex (np. i = ignoruje wielkość liter)
$exists — phone:{$exists:true} — field exists — sprawdza, czy pole istnieje
$type — age:{$type:"number"} — type check — sprawdza typ pola (np. number, string)
$size — tags:{$size:3} — array length — sprawdza, czy tablica ma określoną długość
$elemMatch — scores:{$elemMatch:{math:{$gte:80}}} — match element of array — przynajmniej jeden element tablicy musi spełniać warunek
$all — tags:{$all:["A","B"]} — array contains all — tablica musi zawierać WSZYSTKIE elementy
$expr — $expr:{$gte:[{$strLenCP:"$name"},5]} — use expressions in find() — pozwala używać operatorów agregacyjnych w find()
$strLenCP — inside: $expr — string length — zwraca długość tekstu (Unicode)
$toLower — $expr:{ $eq:[{$toLower:"$name"},"adam"] } — lowercase — zamienia tekst na małe litery
$toUpper — uppercase — zamienia tekst na wielkie litery
$concat — concatenation — łączy teksty
$add — math — dodawanie
$subtract — math — odejmowanie
$multiply — math — mnożenie
$divide — math — dzielenie
$mod — math — modulo (reszta z dzielenia)
$text — $text:{$search:"hello world"} — full-text search — wyszukiwanie pełnotekstowe
$search — inside $text — text query — szuka słów/znaczeń
$caseSensitive — $text:{..., $caseSensitive:false} — case sensitive — uwzględnia wielkość liter
$diacriticSensitive — uwzględnia znaki diakrytyczne (ą,ć,ę,ö)
$bitsAnySet — permissions:{$bitsAnySet:[1,4]} — any bit set — przynajmniej jeden z bitów jest ustawiony
$bitsAllSet — all bits set — wszystkie podane bity muszą być ustawione
$bitsAnyClear — any bit clear — przynajmniej jeden bit musi być wyzerowany
$bitsAllClear — all bits clear — wszystkie podane bity muszą być wyzerowane
$geoWithin — location:{$geoWithin:{...}} — inside area — punkt musi być wewnątrz obszaru
$geoIntersects — location:{$geoIntersects:{...}} — intersects — obszar przecina się z geometrią
$near — location:{$near:[lng,lat]} — near — najbliższe punkty
$nearSphere — spherical near — jak $near, ale liczy kulistą odległość
$where — $where:"this.age > 20" — custom JS logic — uruchamia kod JavaScript na dokumencie (bardzo wolne)
$comment — { $comment: "my custom query note" } — adds comment — dodaje komentarz do zapytania`

    const res = NextResponse.json({data});
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
  return res;
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
  
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
    return response;
  }
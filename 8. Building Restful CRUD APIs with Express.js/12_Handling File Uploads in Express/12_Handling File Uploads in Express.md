Dynamic Routing in Express

1. app.get('/:filename', (req,res)=>{
  
})
 yaha  app.get('/:filename') yaha colon ke baad jo bhi file rahega wo ayega matlab filename

  
2. const {filename} = req.params yaha filename wahi key banega jo app.get me filname likha hai

3.   res.sendFile(`${import.meta.dirname}/storage/${filename}`); yah par par import.meta.riname se uska directory name milega and fir storage me filanme se us file ka dynamic name mil jayega

   
4.  await rm(filePath); isse file delete hota hai

5. // Update
app.patch("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { newFileName } = req.body;
  await rename(`./storage/${filename}`, `./storage/${newFileName}`);
  res.json({ message: "Renamed" });
});



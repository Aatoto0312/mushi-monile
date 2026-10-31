using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Diagnostics;

// The sole Job handle is owned by this watchdog. Closing it (including process
// termination) kills the child tree. Create suspended => assign job => resume:
// there is no running unowned child between launch and assignment.
public static class MushiOwnedJob {
  [StructLayout(LayoutKind.Sequential)] struct Basic { public long ProcessTime, JobTime; public uint Flags; public UIntPtr Min, Max; public uint Active; public UIntPtr Affinity; public uint Priority, Scheduling; }
  [StructLayout(LayoutKind.Sequential)] struct Io { public ulong A,B,C,D,E,F; }
  [StructLayout(LayoutKind.Sequential)] struct Limits { public Basic Basic; public Io Io; public UIntPtr ProcessMemory, JobMemory, PeakProcessMemory, PeakJobMemory; }
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)] struct Startup { public uint cb; public string reserved,desktop,title; public uint x,y,cx,cy,xchars,ychars,fill,flags; public ushort show,reserved2; public IntPtr reservedPtr,input,output,error; }
  [StructLayout(LayoutKind.Sequential)] struct Proc { public IntPtr process,thread; public uint pid,tid; }
  [StructLayout(LayoutKind.Sequential)] struct Security { public uint length; public IntPtr descriptor; [MarshalAs(UnmanagedType.Bool)] public bool inherit; }
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateJobObject(IntPtr a,string b);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetInformationJobObject(IntPtr job,int kind,ref Limits value,uint size);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool AssignProcessToJobObject(IntPtr job,IntPtr process);
  [DllImport("kernel32.dll",SetLastError=true)] static extern uint ResumeThread(IntPtr thread);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool TerminateProcess(IntPtr process,uint code);
  [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
  [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr handle,uint milliseconds);
  [DllImport("kernel32.dll",SetLastError=true)] static extern IntPtr OpenProcess(uint access,bool inherit,int pid);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateFile(string file,uint access,uint share,ref Security security,uint creation,uint flags,IntPtr template);
  [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool CreateProcess(string application,StringBuilder command,IntPtr processSecurity,IntPtr threadSecurity,bool inherit,uint flags,IntPtr environment,string directory,ref Startup startup,out Proc process);
  [DllImport("kernel32.dll",SetLastError=true)] static extern bool GetExitCodeProcess(IntPtr process,out uint code);
  static string Quote(string value) {
    if(value.IndexOf('\0')>=0)throw new InvalidOperationException("ARGUMENT_INVALID");
    var s=new StringBuilder("\"");int slashes=0;
    foreach(char c in value){if(c=='\\'){slashes++;continue;}if(c=='"'){s.Append('\\',slashes*2+1);s.Append(c);}else{s.Append('\\',slashes);s.Append(c);}slashes=0;}
    s.Append('\\',slashes*2);s.Append('"');return s.ToString();
  }
  public static int Run(string executable,string[] arguments,int parentPid,int durationMs) {
    if(durationMs<=0||durationMs>1800000)throw new InvalidOperationException("DEADLINE_INVALID");
    IntPtr job=IntPtr.Zero,parent=IntPtr.Zero,nul=IntPtr.Zero;Proc child=new Proc();bool assigned=false;
    try {
      parent=OpenProcess(0x00100000,false,parentPid);if(parent==IntPtr.Zero)throw new InvalidOperationException("PARENT_MISSING");
      job=CreateJobObject(IntPtr.Zero,null);if(job==IntPtr.Zero)throw new InvalidOperationException("JOB_FAILED");
      var limits=new Limits();limits.Basic.Flags=0x2000;
      if(!SetInformationJobObject(job,9,ref limits,(uint)Marshal.SizeOf(typeof(Limits))))throw new InvalidOperationException("JOB_LIMIT_FAILED");
      var security=new Security();security.length=(uint)Marshal.SizeOf(typeof(Security));security.inherit=true;
      nul=CreateFile("NUL",0xC0000000,3,ref security,3,0,IntPtr.Zero);if(nul==new IntPtr(-1))throw new InvalidOperationException("NUL_FAILED");
      var startup=new Startup();startup.cb=(uint)Marshal.SizeOf(typeof(Startup));startup.flags=0x100;startup.input=nul;startup.output=nul;startup.error=nul;
      var command=new StringBuilder(Quote(executable));foreach(var arg in arguments)command.Append(" "+Quote(arg));
      if(!CreateProcess(executable,command,IntPtr.Zero,IntPtr.Zero,true,0x08000004,IntPtr.Zero,null,ref startup,out child))throw new InvalidOperationException("PROCESS_FAILED");
      if(!AssignProcessToJobObject(job,child.process))throw new InvalidOperationException("JOB_ASSIGN_FAILED");assigned=true;
      if(ResumeThread(child.thread)==0xFFFFFFFF)throw new InvalidOperationException("RESUME_FAILED");
      var elapsed=Stopwatch.StartNew();
      while(elapsed.ElapsedMilliseconds<durationMs&&WaitForSingleObject(parent,0)==258) {
        if(WaitForSingleObject(child.process,100)==0){uint code;GetExitCodeProcess(child.process,out code);return (int)code;}
      }
      return 0;
    } finally {
      if(child.process!=IntPtr.Zero&&!assigned)TerminateProcess(child.process,1);
      if(job!=IntPtr.Zero)CloseHandle(job);
      if(child.process!=IntPtr.Zero){WaitForSingleObject(child.process,3000);CloseHandle(child.process);}
      if(child.thread!=IntPtr.Zero)CloseHandle(child.thread);
      if(parent!=IntPtr.Zero)CloseHandle(parent);
      if(nul!=IntPtr.Zero&&nul!=new IntPtr(-1))CloseHandle(nul);
    }
  }
}
